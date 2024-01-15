import { Router } from "express";
import passport from "passport";

export const router = Router();

router.get("/errorLogin", (req, res) => {
  res.redirect("/registro?error=Error en el proceso de registro");
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/errorLogin",
  }),
  async (req, res) => {
    try {
      console.log("Datos de usuario:", req.user);

      if (req.isAuthenticated()) {
        req.session.usuario = {
          nombre: req.user.nombre,
          email: req.user.email,
          rol: req.user.rol,
        };
      }

      res.redirect("/producto");
    } catch (error) {
      console.error("Error en el proceso de inicio de sesión:", error);
      res.redirect(
        "/login?error=Error inesperado, intente nuevamente en 10 minutos"
      );
    }
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.redirect("/login?error=Fallo en el logout");
    }
  });

  res.redirect("/login");
});

router.get("/errorRegistro", (req, res) => {
  res.redirect("/registro?error=Error en el proceso de registro");
});

router.post(
  "/registro",
  passport.authenticate("registro", {
    failureRedirect: "/api/sessions/errorRegistro",
  }),
  async (req, res) => {
    let { email } = req.body;
    res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`);
  }
);
