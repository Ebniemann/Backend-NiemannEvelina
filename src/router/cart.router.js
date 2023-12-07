import { Router } from "express";
import mongoose from "mongoose";
// import { cartsModels } from "../dao/models/carts.models.js";

const cartPath = "./carrito.json";

export const router = Router();

router.get("/", async (req, res) => {
  let carts = [];

  try {
    carts = await cartsModels.find();
    res.status(200).json({ carts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error inesperado del lado del servidor" });
  }
});

router.post("/", async (req, res) => {
  let carts = [];

  const newCart = { id, products: [] };
  carts.push(newCart);

  saveCarts(carts);

  let existe = false;
  try {
    existe = await CartsModels.findOne();
  } catch (error) {
    res.setHeader("content-type", "application/json");
    return res
      .status(500)
      .json({ error: "Error inesperado del lado del servidor" });
  }
});

// router.post("/:cid/product/:pid", (req, res) => {
//   const cartId = parseInt(req.params.cid);
//   const productId = parseInt(req.params.pid);
//   const carts = getSavedCarts();

//   const cart = carts.find((c) => c.id === cartId);

//   if (!cart) {
//     res.setHeader("content-type", "application/json");
//     return res.status(404).json({ message: "Carrito no encontrado" });
//   }

//   const product = cart.products.find((p) => p.product === productId);

//   if (product) {
//     product.quantity++;
//   } else {
//     cart.products.push({ product: productId, quantity: 1 });
//   }

//   saveCarts(carts);

//   res.setHeader("content-type", "application/json");
//   res.status(201).json(cart);
// });

// export function getSavedCarts() {
//   if (fs.existsSync(cartPath)) {
//     const data = fs.readFileSync(cartPath, "utf-8");
//     return JSON.parse(data);
//   } else {
//     return [];
//   }
// }

// export function saveCarts(carts) {
//   fs.writeFileSync(cartPath, JSON.stringify(carts, null, 4));
// }
