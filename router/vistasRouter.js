import { Router } from "express";
import { ManagerProduct } from "../dao/Manager/ProductManagerM.js";
import { ManagerChat } from "../dao/Manager/ChatManager.js";
import { ManagerCart } from "../dao/Manager/CartManagerM.js";
import { TicketController } from "../controller/ticket.controller.js";

const router = Router();
const productManager = new ManagerProduct();
const chatManager = new ManagerChat();
const cartManager = new ManagerCart();

// Middleware para manejar errores comunes
const errorHandler = (res, errorMessage) => {
  console.error(errorMessage);
  res.status(500).render("error", { message: errorMessage });
};

const auth = (req, res, next) => {
  console.log('auth', req.session.usuario)
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  next();
};

// Rutas
router.get("/", (req, res) => {
  res.render("home");
});

router.get("/producto", auth, async (req, res) => {
  console.log('Ruta Vista /producto')

  try {
    const products = await productManager.listarProductos();

    const { user } = req

    const usuario = {
      _id: user._id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      edad: user.edad,
      cart: user.cart,
      rol: user.rol,
    };

    console.log(usuario)

    res.render("producto", {
      usuario,
      products,
      titulo: "Productos",
      estilos: "stylesHome",
    });
  } catch (error) {
    errorHandler(res, "Error al obtener productos: " + error.message);
  }
});

router.get("/chat", auth, async (req, res) => {
  console.log('Ruta Vista /chat')
  try {
    const messages = await chatManager.obtenerMessage();
    res.render("chat", {
      titulo: "chat",
      estilos: "styles",
      messages: messages || [],
    });
  } catch (error) {
    errorHandler(res, "Error al renderizar la página de chat: " + error.message);
  }
});

router.get("/cart/:cid", async (req, res) => {
  console.log('Ruta Vista /cart/:cid')
  const { cid } = req.params;
  try {
    const cart = await cartManager.obtenerCarritoPorId(cid);
    res.render("cart", {
      cart,
      name: "Carrito de compras",
      estilos: "stylesHome",
    });
  } catch (error) {
    errorHandler(res, "Error al obtener carrito: " + error.message);
  }
});

router.get("/signup", (req, res) => {
  console.log('Ruta Vista /sigup')
  const { error } = req.query;
  res.render("signup", { error, titulo: "Registro", estilos: "stylesHome" });
});

router.get("/login", (req, res) => {
  console.log('Ruta Vista /login')
  const { error, mensaje } = req.query;
  res.render("login", { error, mensaje, titulo: "Ingresar", estilos: "stylesHome" });
});

router.get("/profile", auth, async (req, res) => {
  console.log('Ruta Vista /profile')
  try {
    const usuario = req.session.usuario;

    res.render("profile", {
      usuario,
      titulo: "Perfil de usuario",
      estilos: "stylesProfile",
    });
  } catch (error) {
    errorHandler(res, "Error al obtener el perfil del usuario: " + error.mensaje);
  }
});

router.get("/password-recovery", (req, res) => {
  console.log('Ruta Vista /password-recovery')
  const { error, mensaje } = req.query;
  res.render("password-recovery", { error, mensaje, titulo: "Recuperacion de clave", estilos: "stylesPasswordRecovery" });
});

router.get("/reset-password", (req, res) => {
  console.log('Ruta Vista /reset-password')
  const { error, mensaje, token } = req.query;
  res.render("reset-password", { error, mensaje, token, titulo: "Recuperacion de clave", estilos: "stylesPasswordRecovery" });
});

router.get("/documents", (req, res) => {
  console.log('Ruta Vista /documents')
  const { error, mensaje } = req.query;
  res.render("documents", { error, mensaje, titulo: "Documentos", estilos: "stylesDocuments" });
});

router.get("/signup", (req, res) => {
  console.log('Ruta Vista /signup')
  let { error, mensaje } = req.query;
  res.render("signup", { error, mensaje, titulo: "Registro", estilos: "stylesSignup" });
});

router.get("/:ticketId", TicketController.getTicket);


export default router;
