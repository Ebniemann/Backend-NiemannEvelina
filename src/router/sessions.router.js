import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { usuarioModels } from "../dao/models/usuario.models.js";
import SECRETKEY from "../utils.js";

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
          edad: req.user.edad,
          apellido: req.user.apellido,
          cart: req.user.cart,
        };
      }

      const token = jwt.sign(
        { email: req.user.email, rol: req.user.rol },
        SECRETKEY,
        {
          expiresIn: "1h",
        }
      );

      res.json({ token: token });
      // res.redirect("/perfil");
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

router.get("/errorRecupero", (req, res) => {
  res.redirect("/recuperoclave?error=Error en el proceso");
});

router.post(
  "/recuperoclave",
  passport.authenticate("recuperoclave", {
    failureRedirect: "/api/sessions/errorRecupero",
  }),
  async (req, res) => {
    let { email } = req.body;
    let usuario = await usuarioModels.findOne(email);

    try {
      if (!usuario) {
        return res.redirect("errorRecupero");
      }

      delete usuario.password;
      let token = jwt.sign({ ...usuario }, SECRETKEY, { expiresIn: "1h" });

      let message = `Puede restablecer su clave desde el siguiente link:
      http://localhost:8080/api/sessions/recuperoclave02`;

      let respuesta = await enviarEmail(email, "Restablecer clave", message);

      return res.redirect("recuperoclave", {
        mensaje: "Correo enviado con instrucciones para restablecer la clave",
        respuesta: respuesta,
      });
    } catch (error) {
      console.error("Error en el proceso de recupero de clave:", error);

      return res.redirect("errorRecupero");
    }
  }
);
