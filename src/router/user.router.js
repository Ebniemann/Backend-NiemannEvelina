import { Router } from "express";

import { UserController } from "../controller/user.controller.js";
import { autorizacion } from "../middleware/autorizacion.js";
import { upload } from "../middleware/multer.js";

export const router = Router();

router.put("/premium/:uid", UserController.togglePremiumRole);

router.post(
  "/:uid/documents",
  upload.fields([
    { name: "profilePhoto" },
    { name: "profileProduct" },
    { name: "profileDocument" },
  ]),
  UserController.updateUserDocumentStatus
);
