import { Router } from "express";
import { SessionsController } from "../controller/sessions.controller.js";

export const router = Router();

router.get("/github", SessionsController.getGithubLogin);

router.get("/callbackGitHub", SessionsController.getGitHubCallback);

router.get("/errorGitHub", SessionsController.getGitHubError);

router.get("/errorLogin", SessionsController.getErrorLogin);

router.post("/login", SessionsController.postLogin);

router.get("/logout", SessionsController.postLogout);

router.get("/errorRegistro", SessionsController.getErrorRegistro);

router.post("/registro", SessionsController.postRegistro);
