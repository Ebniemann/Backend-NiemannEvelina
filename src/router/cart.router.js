import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";
import { autorizacion } from "../middleware/autorizacion.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = Router();

const auth = (req, res, next) => {
  console.log('auth', req.session.usuario)
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  next();
};

router.get("/", CartController.getCart);

router.post("/", CartController.postCart);

router.put(
  "/:cid/product/:pid/:quantity?",
  autorizacion(["usuario"]),
  CartController.putCart
);

router.delete("/:cid/product/:pid", CartController.deleteProductCart);

router.delete("/:cid", CartController.deleteCart);

router.post("/:cid/purchase");

export default router;