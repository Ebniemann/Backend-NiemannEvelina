import { Server } from "socket.io";
import { ManagerChat } from "./dao/Manager/ChatManager.js";
import { chatModels } from "./dao/models/chat.models.js";

const chatManager = new ManagerChat();

const setupSocket = (server) => {
  const io = new Server(server);

  let users = [];
  let menssages = [];

  io.on("connection", async (socket) => {
    socket.emit("saludo", {
      emisor: "server",
      mensaje: "Bienvenidos a E-task",
    });
    try {
      const storedMessages = await chatManager.obtenerMessage();
      socket.emit("storedMessages", storedMessages);
    } catch (error) {
      console.error("Error al obtener mensajes almacenados:", error);
    }

    socket.on("getStoredMessages", async () => {
      try {
        const storedMessages = await chatManager.obtenerMessage();
        socket.emit("storedMessages", storedMessages);
      } catch (error) {
        console.error("Error al obtener mensajes almacenados:", error);
      }
    });


    socket.on("id", (nombre) => {
      users.push({ nombre, id: socket.id });
      socket.broadcast.emit("newUser", nombre);
      socket.emit("Bienvenido", menssages);
      socket.userNombre = nombre;
    });

    socket.on("menssage", async (datos) => {
      const newMessages = new chatModels({
        emisor: socket.userNombre,
        message: datos.message,
      });

      try {
        await newMessages.save();
        io.emit("chatMessages", datos);
      } catch (error) {
        console.log(error);
      }
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
