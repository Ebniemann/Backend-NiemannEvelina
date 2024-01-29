import { Router } from "express";
import { ProductController } from "../controller/products.controller.js";

const productRouter = (io) => {
  const router = Router();

  router.get("/", ProductController.getProduct);

  router.get("/:id", ProductController.getProductId);

  router.post("/", ProductController.postProduct);

  router.put("/:id", ProductController.putProduct);

  router.delete("/:id", ProductController.deleteProduct);
  return router;
};

export default productRouter;
