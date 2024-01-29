import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";

export const router = Router();

router.get("/", CartController.getCart);

router.post("/", CartController.postCart);

router.put("/:cid/product/:pid/:quantity?", CartController.putCart);

router.delete("/:cid/product/:pid", CartController.deleteProductCart);

router.delete("/:cid", CartController.deleteCart);
