import { Router } from "express";
import mongoose from "mongoose";
import { cartModel } from "../dao/models/carts.models.js";
import { productsModels } from "../dao/models/products.models.js";

export const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await cartModel.find();
    res.status(200).json({ carts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "Error inesperado del lado del servidor",
      details: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  let { name, products } = req.body;

  try {
    const productIds = products.map(
      (productId) => new mongoose.Types.ObjectId(productId)
    );

    const productsToAdd = await productsModels.find({
      _id: { $in: productIds },
    });

    const newCart = new cartModel({
      name,
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
});

router.post("/:cid/product/:pid/:quantity?", async (req, res) => {
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
});
