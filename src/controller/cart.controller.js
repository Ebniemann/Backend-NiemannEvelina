import { cartModel } from "../dao/models/carts.models.js";
import { productsModels } from "../dao/models/products.models.js";
import mongoose from "mongoose";
import { CartService } from "../Services/cart.service.js";

export class CartController {
  static async getCart(req, res) {
    try {
      const carts = await CartService.getCart();
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

      const newCart = await CartService.createCart(name, productIds);

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
    const { cid, productId, quantity } = req.params;

    try {
      const updateCart = await CartService.updateCart(cid, productId, quantity);

      console.log("Carrito actualizado", updateCart);
      res.status(201).json(updateCart);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
        details: error.message,
      });
    }
  }

  static async deleteProductCart(req, res) {
    const { cid, productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.setHeader("Content-type", "application/json");
      return res.status(400).json({ error: "Ingrese un id válido." });
    }

    try {
      const result = await CartService.deleteProductCart(cid, productId);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: result });
    } catch (error) {
      console.error(error.message);
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
      const result = await CartService.deleteCart(cid);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        payload: result,
      });
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error:
          "Error en el servidor al intentar eliminar los productos del carrito",
      });
    }
  }
}
