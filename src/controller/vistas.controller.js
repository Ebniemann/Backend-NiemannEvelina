import { ManagerProduct } from "../dao/Manager/ProductManagerM.js";
import { ManagerChat } from "../dao/Manager/ChatManager.js";
import { ManagerCart } from "../dao/Manager/CartManagerM.js";

export class VistasController {
  constructor() {
    this.productManager = new ManagerProduct();
    this.chatManager = new ManagerChat();
    this.cartManager = new ManagerCart();
  }

  static async get(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("home");
  }

  static async getProduct(req, res) {
    try {
      let usuario = req.session.usuario;
      const products = await this.productManager.listarProductos();

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
  }

  static async getChat(req, res) {
    try {
      const messages = await this.chatManager.obtenerMessage();
      res.status(200).render("chat", {
        titulo: "chat",
        estilos: "styles",
        messages: messages || [],
      });
    } catch (error) {
      console.error("Error al renderizar la página de chat:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  static async getCartId(req, res) {
    const { cid } = req.params;

    try {
      const cart = await this.cartManager.obtenerCarritoPorId(cid);

      res.status(200).render("cart", {
        cart,
        name: "Carrito de compras",
        estilos: "stylesHome",
      });
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      res.status(500).render("error al obtener carrito de compras");
    }
  }

  static async getRegistro(req, res) {
    console.log("Sesión después de almacenar el usuario:", req.session);

    let { error } = req.query;
    res.setHeader("Content-Type", "text/html");
    res
      .status(200)
      .render("registro", { error, titulo: "Registro", estilos: "stylesHome" });
  }

  static async getLogin(req, res) {
    let { error, mensaje } = req.query;
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("login", {
      error,
      mensaje,
      titulo: "Login",
      estilos: "stylesHome",
    });
  }

  static async getPerfil(req, res) {
    try {
      const usuario = req.session.usuario;
      console.log("Usuario en la sesión:", usuario);

      res.status(200).render("perfil", {
        usuario,
        titulo: "Perfil",
        estilos: "stylesHome",
      });
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error);
      res.status(500).render("error al obtener el perfil del usuario");
    }
  }
}
