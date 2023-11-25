import { Server } from "socket.io";
import ProductManager from "./archivos/ProductManager.js";

const products = new ProductManager("./archivo.json");

const setupSocket = (server) => {
  const io = new Server(server);

  let users = [];
  let menssages = [];

  io.on("connection", (socket) => {
    socket.emit("saludo", {
      emisor: "server",
      mensaje: "Bienvenidos a E-task",
    });

    socket.emit("products", { products: products.getProduct() });

    socket.on("nuevoProducto", (datos) => {
      io.emit("verProduct", { datos });
    });

    socket.on("id", (nombre) => {
      users.push({ nombre, id: socket.id });
      socket.broadcast.emit("newUser", nombre);
      socket.emit("Bienvenido", menssages);
    });

    socket.on("menssage", (datos) => {
      menssages.push(datos);
      io.emit("newMessages", datos);
    });

    socket.on("disconnect", () => {
      let user = users.find((u) => u.id === socket.id);
      if (user) {
        io.emit("userDisconnect", user.nombre);
      }
    });
  });
  return io;
};
export default setupSocket;
