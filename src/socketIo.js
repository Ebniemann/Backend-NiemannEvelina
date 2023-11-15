import { Server } from "socket.io";
import ProductManager from "./archivos/ProductManager.js";

const products = new ProductManager("./archivo.json");

const setupSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Productor Conectado");

    socket.emit("saludo", {
      emisor: "server",
      mensaje: "Bienvenidos a E-task",
    });

    socket.emit("products", { products: products.getProduct() });

    socket.on("nuevoProducto", (datos) => {
      io.emit("verProduct", { datos });
    });
  });
  return io;
};
export default setupSocket;
