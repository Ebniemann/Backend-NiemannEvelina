import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { usuarioModels } from "../dao/models/usuario.models.js";
import { creaHash, validaPassword } from "../utils.js";
import { cartModel } from "../dao/models/carts.models.js";
import mongoose from "mongoose";

export const inicializarPassport = () => {
  passport.use(
    "registro",
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { nombre, apellido, edad, email } = req.body;

          if (!nombre || !apellido || !edad || !email || !password) {
            console.error("Datos de usuario incompletos.");
            return done(null, false);
          }

          const existe = await usuarioModels.findOne({ email });
          if (existe) {
            console.error("El usuario ya existe.");
            return done(null, false);
          }

          const nuevoCarrito = await cartModel.create();
          console.log("Nuevo carrito creado:", nuevoCarrito);

          const hashedPassword = creaHash(password);

          const usuario = await usuarioModels.create({
            nombre,
            apellido,
            edad,
            email,
            cart: nuevoCarrito._id,
            password: hashedPassword,
          });

          return done(null, usuario);
        } catch (error) {
          console.error("Error en passport.use callback:", error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (!username || !password) {
            return done(null, false);
          }

          const usuario = await usuarioModels
            .findOne({ email: username })
            .lean();

          if (!usuario) {
            return done(null, false, { message: "Credenciales incorrectas" });
          }

          if (!validaPassword(usuario, password)) {
            return done(null, false, { message: "Credenciales incorrectas" });
          }

          delete usuario.password;
          return done(null, usuario);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv1.6f990808a1b6ca2a",
        clientSecret: "72c636ff90393d743b864551947cb837ffbc8472",
        callbackURL: "http://localhost:8080/api/sessions/callbackGitHub",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("GitHub Profile:", profile);
        try {
          let usuario = await usuarioModels.findOne({
            email: profile._json.email,
          });

          if (!usuario) {
            let nuevoUsuario = {
              nombre: profile._json.name,
              email: profile._json.email,
              profile,
            };
            usuario = await usuarioModels.create(nuevoUsuario);
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //configurar el serializador y deserializador

  passport.serializeUser((usuario, done) => {
    return done(null, usuario._id);
  });

  passport.deserializeUser(async (id, done) => {
    let usuario = await usuarioModels.findById(id);
    return done(null, usuario);
  });
};
