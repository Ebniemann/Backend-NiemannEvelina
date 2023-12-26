import passport from "passport";
import local from "passport-local";
import { usuarioModels } from "../dao/models/usuario.models.js";
import { creaHash, validaPassword } from "../utils.js";

export const inicializarPassport = () => {
  passport.use(
    "registro",
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        //aca va la logica de registro que la traigo de login-router
        try {
          let { nombre, apellido, edad, email } = req.body;
          if (!nombre || !apellido || !edad || !email || !password) {
            return done(null, false);
          }

          let existe = await usuarioModels.findOne({ email });
          if (existe) {
            return done(null, false);
          }

          password = creaHash(password);

          let usuario;

          try {
            usuario = await usuarioModels.create({
              nombre,
              apellido,
              edad,
              email,
              password,
            });

            return done(null, usuario);

            //previo a devolver un usuario con done, passport graba en la req una propiedad
            // user, con los datos del uduario. Luego pueod hacer req.user y obtener los datos
          } catch (error) {
            console.error("Error creating user:", error);
            return done(null, false);
          }
        } catch (error) {
          console.error("Error in passport.use callback:", error);
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

          let usuario = await usuarioModels.findOne({ email: username }).lean();

          if (!usuario) {
            return done(null, false);
          }

          if (!validaPassword(usuario, password)) {
            return done(null, false);
          }

          return done(null, usuario);
        } catch (error) {
          done(error, null);
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
