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
        // return res.status(404).json({ message: "Carrito no encontrado" });
        throw CustomError.registerError(
          "No se encontro un carrito con ese ID",
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
        // throw error("No se encontro el carrito con ese Id");
        throw CustomError.registerError(
          "No se encontro un carrito con ese ID",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoCart(cid)
        );
      }

      const updateQuery = { $pull: { productos: { _id: pid } } };

      const result = await CartDao.updateCart(cid, updateQuery);

      if (result.nModified > 0) {
        return "Eliminación exitosa";
      } else {
        // throw new Error("No se pudo eliminar el producto");
        throw CustomError.registerError(
          "No se pudo eliminar el producto del carrito",
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
        // throw error("No se encontro un carrito con ese Id");
        throw CustomError.registerError(
          "No se encontro un carrito con ese ID",
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

    const totalCompra = (producto) => {
      return producto.reduce((total, product) => {
        const productoPrice = ProductDao.getProductPrice(producto.id);
        return total + productoPrice * producto.quantity;
      }, 0);
    };

    try {
      const cart = await CartDao.findCartById(cid);

      if (!cart) {
        // throw new Error("Carrito no encontrado");
        throw CustomError.registerError(
          "Carrito no encontrado",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoCart(cid)
        );
      }

      const productosCompra = cart.carrito;
      const fallaProductos = [];
      const productosExitosos = [];

      for (const item of productosCompra) {
        const producto = item.producto;
        const quantityCompra = item.quantity;

        const validaStock = await ProductService.getValidaStock(producto._id);

        if (validaStock >= quantityCompra) {
          await ProductService.updateStock(producto._id, quantityCompra);
          productosExitosos.push({
            producto: producto._id,
            quantity: quantityCompra,
          });
        } else {
          fallaProductos.push(producto._id);
        }
      }

      const ticketData = {
        code: ticketCode(),
        purchase_datetime: new Date(),
        amount: totalCompra(successfulProducts),
        purchaser: cart.user.email,
        productos: successfulProducts,
      };

      const ticket = await TicketService.crearTicket(ticketData);

      const productosRestantes = productosCompra.filter(
        (item) => !fallaProductos.includes(item.producto._id.toString())
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
}
