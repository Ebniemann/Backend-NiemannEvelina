import { Router } from "express";
import { ProductController } from "../controller/products.controller.js";
import { autorizacion } from "../middleware/autorizacion.js";
import generaProducto from "../mock/product.mock.js";

const productRouter = (io) => {
  const router = Router();

  router.get("/producto", ProductController.getProduct);

  router.get("/:id", ProductController.getProductId);

  router.post("/", autorizacion(["admin"]), ProductController.postProduct);

  router.put("/:id", autorizacion(["admin"]), ProductController.putProduct);

  router.delete(
    "/:id",
    autorizacion(["admin"]),
    ProductController.deleteProduct
  );

  router.get("/mockingsproducts", (req, res) => {
    let { cantidad } = req.query;
    if (!cantidad || cantidad === 0) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ eror: "Ingrese cantidad !" });
    }
    let productos = generaProducto();

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: productos });
  });
  return router;
};

export default productRouter;
