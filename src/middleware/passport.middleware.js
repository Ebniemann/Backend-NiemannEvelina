import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { usuarioModels } from "../dao/models/usuario.models.js";
import { creaHash, validaPassword } from "../utils.js";
import { cartModel } from "../dao/models/carts.models.js";
import { usuarioDto } from "../dao/DTO/dto.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

// Opciones JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

// Estrategia de Passport para registro de usuario
const signupStrategy = new local.Strategy(
  {
    passReqToCallback: true,
    usernameField: "email",
  },
  async (req, email, password, done) => {
    try {
      const { nombre, apellido, edad } = req.body;

      if (!nombre || !apellido || !edad || !email || !password) {
        console.error("Datos de usuario incompletos.");
        return done(null, false, { message: "Datos de usuario incompletos" });
      }

      const existe = await usuarioModels.findOne({ email });
      if (existe) {
        console.error("El usuario ya existe.");
        return done(null, false, { message: "El usuario ya existe" });
      }

      const nuevoCarrito = await cartModel.create({});
      const hashedPassword = creaHash(password);
      const usuario = await usuarioModels.create({
        nombre,
        apellido,
        edad,
        email,
        cart: nuevoCarrito._id,
        password: hashedPassword,
        rol: req.body.rol,
      });

      return done(null, usuario);
    } catch (error) {
      console.error("Error en signup strategy:", error);
      return done(error);
    }
  }
);

// Estrategia de Passport para inicio de sesión
const loginStrategy = new local.Strategy(
  {
    usernameField: "email",
    session: false,
  },
  async (email, password, done) => {
    try {
      if (!email || !password) {
        return done(null, false, { message: "Por favor, ingrese email y/o contraseña" });
      }

      let usuario = await usuarioModels.findOne({ email });

      if (!usuario || !validaPassword(usuario.password, password)) {
        return done(null, false, { message: "Credenciales incorrectas" });
      }
      usuario.conexion = Date.now();
      usuario = await usuario.save();

      const usuarioInfo = {
        _id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        edad: usuario.edad,
        cart: usuario.cart,
        rol: usuario.rol,
      };

      return done(null, usuarioInfo);
    } catch (error) {
      console.error("Error en login strategy:", error);
      return done(error);
    }
  }
);

// Estrategia de Passport para autenticación con GitHub
const githubStrategy = new github.Strategy(
  {
    clientID: "Iv1.6f990808a1b6ca2a",
    clientSecret: "72c636ff90393d743b864551947cb837ffbc8472",
    callbackURL: "http://localhost:8080/api/sessions/callbackGitHub",
  },
  async (accessToken, refreshToken, profile, done) => {
    if (profile._json.email === null) {
      return done(null, false, { message: "La cuenta de GitHub no posee un email configurado." });
    }
    try {
      let user = await usuarioModels.findOne({ email: profile._json.email });

      if (!user) {
        const newUser = {
          nombre: profile._json.name,
          email: profile._json.email,
          avatar: profile._json.avatar_url,
          conexion: Date.now(),
          profile,
        };

        user = await usuarioModels.create(newUser);
      } else {
        user.profile = profile;
        user.avatar = profile._json.avatar_url;
        user.conexion = Date.now();
        user = await user.save();
      }

      const usuarioInfo = {
        _id: user._id,
        email: user.email,
        nombre: user.nombre,
        avatar: user.avatar,
        apellido: user.apellido,
        edad: user.edad,
        rol: user.rol,
        conexion: user.conexion
      };

      return done(null, usuarioInfo);
    } catch (error) {
      console.error("Error en GitHub strategy:", error);
      return done(error);
    }
  }
);

// Estrategia de Passport para JWT
const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  const userDTO = new usuarioDto(...Object.values(jwtPayload));
  return done(null, userDTO);
});

const initializePassport = () => {
  passport.use("signup", signupStrategy);
  passport.use("login", loginStrategy);
  passport.use("github", githubStrategy);
  passport.use(jwtStrategy);

  passport.serializeUser((usuario, done) => {
    return done(null, usuario._id);
  });

  passport.deserializeUser(async (id, done) => {
    let usuario = await usuarioModels.findById(id);
    return done(null, usuario);
  });
};

export default initializePassport;