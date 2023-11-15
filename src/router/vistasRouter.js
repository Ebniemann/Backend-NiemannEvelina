import { Router } from "express";
import ProductManager from "../archivos/ProductManager.js";

export const router = Router();
const products = new ProductManager("./archivo.json");

router.get("/", (req, res) => {
  try {
    let product = products.getProduct();
    res.status(200).render("home", { product });
  } catch (error) {
    console.error("error", error);
    res.status(500).render("error al obtener el producto");
  }
});

router.get("/realtimeproducts", (req, res) => {
  try {
    let product = products.getProduct();
    res.status(200).render("realtimeproducts", { product });
  } catch (error) {
    console.error("error", error);
    res.status(500).render("error al obtener el producto");
  }
});
