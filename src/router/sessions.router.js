import { Router } from "express";
import passport from "passport";

export const router = Router();

router.get("/github", passport.authenticate("github", {}), (req, res) => {});

router.get(
  "/callbackGitHub",
  passport.authenticate("github", {
    failureRedirect: "/api/sessions/errorGitHub",
  }),
  (req, res) => {
    req.session.usuario = req.user;
    res.redirect("/producto");
  }
);

router.get("/errorGitHub", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(500).json({
    error: "error de autenticar con github",
  });
});
