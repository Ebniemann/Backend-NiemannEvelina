import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { autorizacion } from "../middleware/autorizacion.js";

export const router = Router();

router.put(
  "/premium/:uid",
  autorizacion(["admin"]),
  UserController.togglePremiumRole
);
