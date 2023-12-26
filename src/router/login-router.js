import { Router } from "express";
// import crypto from "crypto";
import passport from "passport";

export const router = Router();

router.get("/errorLogin", (req, res) => {
  try {
  } catch (error) {
    console.error("Error!!!!!", error);
    return res.redirect("/registro?error=Error en el proceso de registro");
  }
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/errorLogin",
  }),
  async (req, res) => {
    try {
      console.log("datos de usuario", req.user);
      // let { email, password } = req.body;

      // email = email.trim();

      // if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      //   req.session.usuario = {
      //     nombre: "Admin",
      //     email: "adminCoder@coder.com",
      //     password: "adminCod3r123",
      //     rol: "admin",
      //   };
      //   return res.redirect("/producto");
      // }

      // contraseña = crypto
      //   .createHmac("sha256", "coder123")
      //   .update(contraseña)
      //   .digest("hex");

      req.session.usuario = {
        nombre: req.user.nombre,
        email: req.user.email,
        rol: req.user.rol,
      };

      res.redirect("/producto");
    } catch (error) {
      console.error("Error en el proceso de inicio de sesión:", error);
      res.redirect(
        "/login?error=Error inesperado, intente nuevamente en 10 min"
      );
    }
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.redirect("/login?error=fallo en el logout");
    }
  });

  res.redirect("/login");
});

router.get("/errorRegistro", (req, res) => {
  try {
  } catch (error) {
    return res.redirect("/registro?error=Error en el proceso de registro");
  }
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
