import __dirname from "./utils.js";
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

import { inicializarPassport } from "./config/config.passport.js";
import passport from "passport";

const PORT = 8080;

const app = express();

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

app.use("/api/products", productRouter(io));
app.use("/api/sessions", sessionsRouter);
app.use("/api/cart", cartRouter);
app.use("/cart/:cid", viewsRouter);
app.use("/", viewsRouter);
app.use("/registro", viewsRouter);
app.use("/login", viewsRouter);
app.use("/producto", viewsRouter);
app.use("/chat", viewsRouter);
app.use("/cart", viewsRouter);
// app.use("/realtimeproducts", viewsRouter);

try {
  await mongoose.connect(
    "mongodb+srv://ebelen89:coderapp@cluster0.lskftra.mongodb.net/?retryWrites=true&w=majority",
    { dbName: "ecommerce" }
  );
  console.log("conectado");
} catch (error) {
  console.log(error.message);
}
