import { CartDao } from "../dao/cart.MemoryDao.js";
import { productsModels } from "../dao/models/products.models.js";
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
}
