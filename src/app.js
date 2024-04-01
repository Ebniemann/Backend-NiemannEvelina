import __dirname from "./utils.js";
import { loggerMiddleware } from "./utils.js";
import path from "path";
import express from "express";
import { engine } from "express-handlebars";
import socketIo from "./socketIo.js";
import mongoose from "mongoose";
import sessions from "express-session";
import mongoStore from "connect-mongo";
import productRouter from "./router/products-router.js";
import { router as cartRouter } from "./router/cart.router.js";
import { router as viewsRouter } from "./router/vistasRouter.js";
import { router as sessionsRouter } from "./router/sessions.router.js";
import { router as userRouter } from "./router/user.router.js";
import { inicializarPassport } from "./config/config.passport.js";

import passport from "passport";
import passportJWT from "jsonwebtoken";
import { errorHandler } from "./middleware/errorHandler.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const PORT = 8080;

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API E-commerce",
      version: "1.0.0",
      description: "Documento API eve",
    },
  },
  apis: ["./src/docs/*.yaml"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(
  sessions({
    secret: "coder123",
    resave: true,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl:
        "mongodb+srv://ebelen89:coderapp@cluster0.lskftra.mongodb.net/?retryWrites=true&w=majority",
      mongoOptions: {
        dbName: "login",
      },
    }),
  })
);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

inicializarPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "/public")));

const server = app.listen(PORT, () => {
  console.log("hola");
});

const io = socketIo(server);

const routerProduct = productRouter(io);
app.use(loggerMiddleware);
app.use((req, res, next) => {
  console.log("Solicitud a la ruta:", req.path);
  next();
});
app.use("/api/products", productRouter(io));
app.use("/api/cart", cartRouter);
app.use("/api/user", userRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

app._router.stack.forEach((route) => {
  if (route.route && route.route.path) {
    console.log(`Registered route: ${route.route.path}`);
  }
});

app.get("/loggerTest", (req, res) => {
  req.logger.info("Este es un mensaje de info");
  req.logger.warn("Este es un mensaje de advertencia");
  req.logger.error("Este es un mensaje de error");

  res.send("Prueba de logs completa en las vistas");
});

app.use(errorHandler);

try {
  await mongoose.connect(
    "mongodb+srv://ebelen89:coderapp@cluster0.lskftra.mongodb.net/?retryWrites=true&w=majority",
    { dbName: "ecommerce" }
  );
  console.log("conectado");
} catch (error) {
  console.log(error.message);
}
