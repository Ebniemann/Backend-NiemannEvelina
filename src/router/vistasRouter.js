import { Router } from "express";
import { VistasController } from "../controller/vistas.controller.js";

export const router = Router();

const auth = (req, res, next) => {
  if (!req.session.usuario) {
    res.redirect("/login");
  }
  next();
};

router.get("/", VistasController.get.bind(VistasController));

router.get(
  "/producto",
  auth,
  VistasController.getProduct.bind(VistasController)
);

router.get("/chat", auth, VistasController.getChat.bind(VistasController));

router.get("/cart/:cid", VistasController.getCartId.bind(VistasController));

router.get("/registro", VistasController.getRegistro.bind(VistasController));

router.get("/login", VistasController.getLogin.bind(VistasController));

router.get("/perfil", auth, VistasController.getPerfil.bind(VistasController));

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
