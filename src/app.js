import __dirname from "./utils.js";
import path from "path";
import express from "express";
import { engine } from "express-handlebars";
import socketIo from "./socketIo.js";

import productRouter from "./router/products-router.js";
import { router as cartRouter } from "./router/cart.router.js";
import { router as viewsRouter } from "./router/vistasRouter.js";

const PORT = 8080;

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));

const server = app.listen(PORT, () => {
  console.log("hola");
});

const io = socketIo(server);

const routerProduct = productRouter(io);

app.use("/api/products", routerProduct);
app.use("/api/cart", cartRouter);

app.use("/", viewsRouter);
app.use("/realtimeproducts", viewsRouter);
app.use("/chat", viewsRouter);
