import { cartModel } from "../dao/models/carts.models.js";
import { productsModels } from "../dao/models/products.models.js";
import mongoose from "mongoose";

export class CartController {
  static async getCart(req, res) {
    try {
      const carts = await cartModel.find();
      res.status(200).json({ carts });
    } catch (error) {
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
      });
    }
  }

  static async postCart(req, res) {
    let { name, products } = req.body;

    try {
      const productIds = products.map(
        (productId) => new mongoose.Types.ObjectId(productId)
      );

      const productsToAdd = await productsModels.find({
        _id: { $in: productIds },
      });

      const newCart = new cartModel({
        carrito: productsToAdd.map((product) => ({
          producto: product._id,
          quantity: 1,
        })),
      });

      await newCart.save();

      res.status(200).json({ newCart });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
        details: error.message,
      });
    }
  }

  static async putCart(req, res) {
    const { cid, pid, quantity } = req.params;

    try {
      const cart = await cartModel.findById(cid);

      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      const productToUpdate = cart.carrito.find((p) => {
        if (p.producto && p.producto.equals(pid)) {
          return true;
        }
        return false;
      });

      const quantityToUpdate = parseInt(quantity) || 1;

      if (productToUpdate) {
        productToUpdate.quantity += quantityToUpdate;
      } else {
        cart.carrito.push({
          producto: pid,
          quantity: quantityToUpdate,
        });
      }

      await cart.save();

      console.log("Carrito Actualizado:", cart);

      res.status(201).json(cart);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
        details: error.message,
      });
    }
  }

  static async deleteProductCart(req, res) {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.setHeader("Content-type", "application/json");
      return res.status(400).json({ error: "Ingrese un id válido." });
    }

    let existe;
    try {
      existe = await cartModel.findOne({ _id: cid });
    } catch (error) {
      res.setHeader("content-type", "application/json");
      return res.status(500).json({ error: "no se encontro el carrito" });
    }
    if (!existe) {
      res.setHeader("COntent-type", "application/json");
      return res
        .status(400)
        .json({ error: `No existe un carrito con ese ${cid}` });
    }
    try {
      const result = await cartModel.updateOne(
        { _id: cid },
        { $pull: { products: { _id: pid } } }
      );
      if (result.nModified > 0) {
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ payload: "Eliminación exitosa" });
      } else {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: "No se puedo eliminar el producto" });
      }
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: "Error del lado del servidor" });
    }
  }

  static async deleteCart(req, res) {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.setHeader("Content-type", "application/json");
      return res
        .status(400)
        .json({ error: "Ingrese un ID válido para el carrito." });
    }

    try {
      const result = await cartModel.updateOne(
        { _id: cid },
        { $set: { carrito: [] } }
      );

      if (result.nModified > 0) {
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({
          payload: "Eliminación exitosa de todos los productos del carrito",
        });
      } else {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: "No se pudieron eliminar los productos del carrito" });
      }
    } catch (error) {
      console.error(error);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error:
          "Error en el servidor al intentar eliminar los productos del carrito",
      });
    }
  }
}
