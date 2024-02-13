import { CartDao } from "../dao/cart.MemoryDao.js";
import { productsModels } from "../dao/models/products.models.js";

export class CartService {
  static async getCart() {
    try {
      const carts = await CartDao.getCart();
      return carts;
    } catch (error) {
      throw new Error(`Error en el servicio: ${error.message}`);
    }
  }

  static async createCart(name, productIds) {
    try {
      const productsToAdd = await productsModels.find({
        _id: { $in: productIds },
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

  static async updateCart(cid, productId, quantity) {
    try {
      const cart = await CartDao.findCartById(cid);

      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      const productToUpdate = cart.carrito.find((p) =>
        p.producto.equals(productId)
      );

      if (productToUpdate) {
        productToUpdate.quantity += parseInt(quantity) || 1;
      } else {
        cart.carrito.push({
          producto: productId,
          quantity: parseInt(quantity) || 1,
        });
      }

      await CartDao.saveCart(cart);

      return cart;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProductCart(cid, productId) {
    try {
      const cart = await CartDao.findCartById(cid);

      if (!cart) {
        throw error("No se encontro el carrito con ese Id");
      }

      const updateQuery = { $pull: { productos: { _id: productId } } };

      const result = await CartDao.updateCart(cid, updateQuery);

      if (result.nModified > 0) {
        return "Eliminación exitosa";
      } else {
        throw new Error("No se pudo eliminar el producto");
      }
    } catch (error) {
      throw error;
    }
  }

  static async deleteCart(cid) {
    try {
      const cart = await CartDao.findCartById(cid);
      if (!cart) {
        throw error("No se encontro un carrito con ese Id");
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
