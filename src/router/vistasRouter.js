import { Router } from "express";
import { managerProduct } from "../dao/ProductManagerM.js";
import { ManagerChat } from "../dao/ChatManager.js";
import { ManagerCart } from "../dao/CartManagerM.js";

export const router = Router();
const productManager = new managerProduct();
const chatManager = new ManagerChat();
const cartManager = new ManagerCart();

const auth = (req, res, next) => {
  if (!req.session.usuario) {
    res.redirect("/login");
  }
  next();
};

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("home");
});

router.get("/producto", auth, async (req, res) => {
  try {
    let usuario = req.session.usuario;
    const products = await productManager.listarProductos();

    res.status(200).render("producto", {
      usuario,
      products,
      titulo: "Productos",
      estilos: "stylesHome",
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).render("error al obtener el producto");
  }
});

router.get("/chat", auth, async (req, res) => {
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

router.get("/cart/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.obtenerCarritoPorId(cid);

    res.status(200).render("cart", {
      cart,
      name: "Carrito de compras",
      estilos: "stylesHome",
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).render("error al obtener carrito de compras");
  }
});

router.get("/registro", (req, res) => {
  let { error } = req.query;
  res.setHeader("Content-Type", "text/html");
  res
    .status(200)
    .render("registro", { error, titulo: "Registro", estilos: "stylesHome" });
});

router.get("/login", (req, res) => {
  let { error, mensaje } = req.query;
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("login", {
    error,
    mensaje,
    titulo: "Login",
    estilos: "stylesHome",
  });
});

router.get("/perfil", auth, async (req, res) => {
  try {
    const usuario = req.session.usuario;
    res.status(200).render("perfil", {
      usuario,
      titulo: "Perfil",
      estilos: "stylesHome",
    });
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).render("error al obtener el perfil del usuario");
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

// router.get("/cart", async (req, res) => {
//   try {
//     const carts = await cartManager.listarCarritos();
//     res.status(200).render("cart", {
//       carts,
//       name: "Carrito de compras",
//       estilos: "stylesHome",
//     });
//   } catch (error) {
//     console.error("error", error);
//     res.status(500).render("error al obtener carrito de compras");
//   }
// });
