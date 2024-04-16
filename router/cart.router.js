import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";
import { autorizacion } from "../middleware/autorizacion.js";

const router = Router();

router.get("/", CartController.getCart);

router.post("/", CartController.postCart);

router.put(
  "/:cid/product/:pid/:quantity?",
  autorizacion(["usuario"]),
  CartController.putCart
);

router.delete("/:cid/product/:pid", CartController.deleteProductCart);

router.delete("/:cid", CartController.deleteCart);

router.put("/:cid/purchase", CartController.purchaseCart);

export default router;