import passport from "passport";
import { SessionsMemoryDAO } from "../dao/sessions.MemoryDao.js";

let dao = new SessionsMemoryDAO();

export class SessionsController {
  static async getGithubLogin(req, res, next) {
    passport.authenticate("github", {})(req, res, next);
  }

  static async getGitHubCallback(req, res, next) {
    passport.authenticate("github", {
      failureRedirect: "/api/sessions/errorGitHub",
    })(req, res, next);
  }

  static async getGitHubError(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({
      error: "error de autenticar con github",
    });
  }

  static async getErrorLogin(req, res) {
    res.redirect("/registro?error=Error en el proceso de registro");
  }

  static postLogin(req, res, next) {
    passport.authenticate("login", async (err, user, info) => {
      try {
        if (err) {
          console.error("Error en el proceso de inicio de sesión:", err);
          return res.redirect(
            "/login?error=Error inesperado, intente nuevamente en 10 minutos"
          );
        }

        if (!user) {
          return res.redirect("/api/sessions/errorLogin");
        }

        const usuario = {
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          edad: user.edad,
          apellido: user.apellido,
          cart: user.cart,
        };

        req.login(user, (err) => {
          if (err) {
            console.error("Error en el proceso de inicio de sesión:", err);
            return res.redirect(
              "/login?error=Error inesperado, intente nuevamente en 10 minutos"
            );
          }

          return res.redirect("/perfil");
        });
      } catch (error) {
        console.error("Error en el proceso de inicio de sesión:", error);
        res.redirect(
          "/login?error=Error inesperado, intente nuevamente en 10 minutos"
        );
      }
    })(req, res, next);
  }

  static async postLogout(req, res) {
    req.session.destroy((error) => {
      if (error) {
        res.redirect("/login?error=Fallo en el logout");
      }
    });

    res.redirect("/login");
  }

  static async getErrorRegistro(req, res) {
    res.redirect("/registro?error=Error en el proceso de registro");
  }

  static async postRegistro(req, res) {
    passport.authenticate("registro", {
      failureRedirect: "/api/sessions/errorRegistro",
      successRedirect: "/login",
    })(req, res, async () => {
      try {
        let { nombre, apellido, edad, email, password } = req.body;

        const usuario = {
          nombre,
          apellido,
          edad,
          email,
          password,
          rol: "usuario",
        };

        await dao.create(usuario);

        // res.redirect(
        //   `/login?mensaje=Usuario ${email} registrado correctamente`
        // );
      } catch (error) {
        console.error("Error en el proceso de registro:", error);
        res.redirect("/registro?error=Error en el proceso de registro");
      }
    });
  }
}
