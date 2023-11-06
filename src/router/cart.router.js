const express = require("express");
const fs = require("fs");
const { Router } = require("express");

const cartPath = "./carrito.json";

const router = Router();

router.post("/", (req, res) => {
  let carts = getSavedCarts();

  let id = 1;
  if (carts.length > 0) {
    id = carts[carts.length - 1].id + 1;
  }

  const newCart = { id, products: [] };
  carts.push(newCart);

  saveCarts(carts);

  res.setHeader("content-type", "application/json");
  res.status(201).json(newCart);
});

router.post("/:cid/product/:pid", (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const carts = getSavedCarts();

  const cart = carts.find((c) => c.id === cartId);

  if (!cart) {
    res.setHeader("content-type", "application/json");
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  const product = cart.products.find((p) => p.product === productId);

  if (product) {
    product.quantity++;
  } else {
    cart.products.push({ product: productId, quantity: 1 });
  }

  saveCarts(carts);

  res.setHeader("content-type", "application/json");
  res.status(201).json(cart);
});

function getSavedCarts() {
  if (fs.existsSync(cartPath)) {
    const data = fs.readFileSync(cartPath, "utf-8");
    return JSON.parse(data);
  } else {
    return [];
  }
}

function saveCarts(carts) {
  fs.writeFileSync(cartPath, JSON.stringify(carts, null, 4));
}

module.exports = router;