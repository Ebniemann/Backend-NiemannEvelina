import { Router } from "express";
import { managerProduct } from "../dao/ProductManagerM.js";
import { ManagerChat } from "../dao/ChatManager.js";

export const router = Router();
const productManager = new managerProduct();
const chatManager = new ManagerChat();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.listarProductos();
    res
      .status(200)
      .render("home", { products, titulo: "Home Page", estilos: "stylesHome" });
  } catch (error) {
    console.error("error", error);
    res.status(500).render("error al obtener el producto");
  }
});

//Vista del Socket Io
// router.get("/realtimeproducts", async (req, res) => {
//   try {
//     const products = await productManager.listarProductos();
//     res.status(200).render("realtimeproducts", { products });
//   } catch (error) {
//     console.error("Error al obtener los productos", error);
//     res
//       .status(500)
//       .render("error", { errorMessage: "Error al obtener los productos" });
//   }
// });

router.get("/chat", async (req, res) => {
  try {
    const messages = await chatManager.obtenerMessage();
    res.status(200).render("chat", {
      titulo: "chat",
      estilos: "styles",
      messages: messages || [],
    });
  } catch (error) {
    console.error("Error al renderizar la página de chat:", error);
    res.status(500).send("Error interno del servidor");
  }
});
