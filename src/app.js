const express = require("express");
const productRouter = require("./router/products.router");
const cartRouter = require("./router/cart.router");

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("<h2>Bienvenidos!</h2>");
});

const server = app.listen(PORT, () => {
  console.log("hola");
});
