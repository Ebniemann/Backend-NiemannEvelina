import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { autorizacion } from "../middleware/autorizacion.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.put("/premium/:uid", UserController.togglePremiumIfHasDocuments);

router.post(
  "/:uid/documents",
  upload.fields([
    { name: "profilePhoto" },
    { name: "profileProduct" },
    { name: "profileDocument" },
  ]),
  UserController.updateUserDocumentStatus
);

router.get("/", UserController.getUser);

router.delete("/remove", UserController.deleteUser);

export default router
