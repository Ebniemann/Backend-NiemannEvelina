import { Router } from "express";
import { UserService } from "../Services/user.service.js";
import { creaHash, verifyPasswordResetToken } from '../utils.js'
import passport from "passport";
import {generaAuthToken} from "../utils.js"

const router = Router();

// URL de redirección para errores de autenticación
const authErrorRedirect = "/login?error=";

// URL de redirección para éxito en la autenticación
const successRedirect = "/profile";

// GitHub Authentication
router.get("/github-error", (req, res) => {
  res.redirect(authErrorRedirect + "Error de autenticación con GitHub");
});
router.get("/github", passport.authenticate("github", {}));
router.get(
  "/callbackGitHub",
  passport.authenticate("github", { failureRedirect: "/api/sessions/github-error" }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { password, profile, ...rest } = req.user;
      req.session.usuario = rest;
    }

    res.redirect(successRedirect);
  }
);

// Login
router.get("/login-error", (req, res) => {
  res.redirect(authErrorRedirect + "Usuario o contraseña incorrectos");
});
router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/login-error" }), async (req, res) => {
  if (req.isAuthenticated()) {
    const { password, profile, ...rest } = req.user;
    req.session.usuario = rest;
  }

  req.session.userId = req.user._id;

  
  const token = generaAuthToken(req.user);

  req.session.token = token;

  console.log(token)

  try {
    res.redirect(successRedirect);
  } catch (error) {
    res.redirect(authErrorRedirect + "Error inesperado, intente nuevamente en 10 minutos");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.redirect(authErrorRedirect + "Hubo un error al cerrar sesión");
    } else {
      res.redirect("/login");
    }
  });
});

// signup
router.get("/signup-error", (req, res) => {
  res.redirect(authErrorRedirect + "Error al intentar registrarse");
});
router.post("/signup", passport.authenticate("signup", { failureRedirect: "/api/sessions/signup-error" }), async (req, res) => {
  const { email } = req.body;
  res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`);
});

// Route to initiate password recovery
router.post('/password-recovery', async (req, res) => {
  try {
    console.log(req.body)
    const { email } = req.body;
    const emailsent = await UserService.sendRecoverPasswordEmail(email)

    if (emailsent) {
      res.redirect(`/reset-password`);
    } else {
      res.redirect(`/password-recovery?mensaje=Error al enviar email de recuperación`);
    }
  } catch (error) {
    console.error('Error in password recovery:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to handle password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, repeat_password } = req.body;

    if (password === repeat_password) {
      // Verify the token
      const decryptedToken = verifyPasswordResetToken(token);

      // Find the user by decryptedToken and update the password
      const user = await UserService.findOneAndUpdate({ email: decryptedToken.email }, { password: creaHash(password) });

      if (!user) {
        return res.status(404).json({ message: 'Error al actualizar la clave.' });
      }

      res.redirect(`/login`);
    } else {
      res.redirect(`/reset-password?mensaje=Las claves no coinciden.`);
    }
  } catch (error) {
    console.error('Error in password reset:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
