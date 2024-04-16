import { CartDao } from "../dao/cart.MemoryDao.js";
import { productsModels } from "../dao/models/products.models.js";
import { ProductService } from "./products.service.js";
import { ProductDao } from "../dao/products.MemoryDao.js";
import { TicketService } from "./ticket.service.js";
import { CustomError } from "../Errors/CustomError.js";
import { STATUS_CODE } from "../errors/tiposError.js";
import { errorArgumentoCart } from "../errors/erroresCart.js";

export class CartService {
  static async getCart() {
    try {
      const carts = await CartDao.getCart();
      if (!carts) {
        throw new CustomError(
          "CustomError",
          "CartService - getCart - No hay carrito en la BD",
          STATUS_CODE.NOT_FOUND,
          errorBdCart()
        );
      }
      return carts;
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }
  }
  static async getCartById(cid) {
    try {
      const cartId = await CartDao.findCartById(cid);
      if (!cartId) {
        throw new CustomError(
          "CustomError",
          "CartService - getCartById - No se encontro un carrito con ese ID",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoCart(cid)
        );
      }
      return cartId;
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }
  }

  static async createCart(name, pid) {
    try {
      const productsToAdd = await productsModels.find({
        _id: { $in: pid },
      });

      const cartData = {
        name,
        carrito: productsToAdd.map((product) => ({
          producto: product._id,
          quantity: 1,
        })),
      };

      const newCart = await CartDao.createCart(cartData);
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  static async updateCart(cid, pid, quantity, rol) {
    try {
      const cart = await CartDao.findCartById(cid);

      if (!cart) {
        throw new CustomError(
          "CustomError",
          "CartService - updateCart - No se encontro un carrito con ese ID",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoCart(cid)
        );
      }

      const productToUpdate = cart.carrito.find((p) => p.producto.equals(pid));
      const product = await productsModels.findById(pid);

      if (productToUpdate) {
        productToUpdate.quantity += parseInt(quantity) || 1;
      } else {
        cart.carrito.push({
          producto: pid,
          quantity: parseInt(quantity) || 1,
        });
      }

      await CartDao.saveCart(cart);

      return cart;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProductCart(cid, pid) {
    try {
      const cart = await CartDao.findCartById(cid);

      if (!cart) {
        throw new CustomError(
          "CustomError",
          "CartService - deleteProductCart - No se encontro un carrito con ese ID",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoCart(cid)
        );
      }

      const updateQuery = { $pull: { productos: { _id: pid } } };

      const result = await CartDao.updateCart(cid, updateQuery);

      if (result.nModified > 0) {
        return "Eliminación exitosa";
      } else {
        throw new CustomError(
          "CustomError",
          "CartService - deleteProductCart - No se pudo eliminar el producto del carrito",
          STATUS_CODE.ERROR_SERVIDOR
        );
      }
    } catch (error) {
      throw error;
    }
  }

  static async deleteCart(cid) {
    try {
      const cart = await CartDao.findCartById(cid);
      if (!cart) {
        throw new CustomError(
          "CustomError",
          "CartService - deleteCart - No se encontro un carrito con ese ID",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoCart(cid)
        );
      }

      const updateQuery = { $set: { carrito: [] } };

      const result = await CartDao.updateCart(cid, updateQuery);
      if (result.nModified > 0) {
        return `Eliminacion exitoda del carrito ${cid}`;
      } else {
        throw new Error(`No se pudo eliminar el carrito ${cid}`);
      }
    } catch (error) {
      throw error;
    }
  }

  static async purchaseCart(cid) {
    const ticketCode = () => {
      const timestamp = Date.now().toString(36);
      const randomChars = Math.random().toString(36).substr(2, 5);
      return `${timestamp}-${randomChars}`.toUpperCase();
    };

    const totalCompra = (productos) => {
      return productos.reduce((total, product) => {
        const productoPrice = ProductDao.getProductsPrice(product.producto);
        return total + productoPrice * product.quantity;
      }, 0);
    };

    const productosExitosos = []
    const fallaProductos = []

    for (const item of productosCompra){
      const producto = item.producto;
      const quantityCompra = item.quantity
      const validaStock = await ProductService.getValidaStock(producto);

      if (validaStock >= quantityCompra) {
        await ProductService.updateStock(producto, quantityCompra);
        productosExitosos.push({
          producto,
          quantity: quantityCompra,
        });
      } else {
        fallaProductos.push(producto);
      }
    }
    
    const ticketData = {
      code: ticketCode(),
      purchase_datetime: new Date(),
      amount: totalCompra(productosExitosos),
      purchaser: cart.user.email,
      productos: productosExitosos,
    };
    
    const ticket = await TicketService.crearTicket(ticketData);
    
    const productosRestantes = productosCompra.filter(
      (item) => !fallaProductos.includes(item.producto)
    );

    
      cart.carrito = productosRestantes;
      await CartDao.saveCart(cart);

      return {
        message: "Compra exitosa",
        ticket,
        fallaProductos,
      };
    } catch (error) {
      res.setHeader("Content-Type", "application/json");

      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }
  }

