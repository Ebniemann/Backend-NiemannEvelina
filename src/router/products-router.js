import { Router } from "express";
import { ProductController } from "../controller/products.controller.js";
import { autorizacion } from "../middleware/autorizacion.js";

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
  return router;
};

export default productRouter;
