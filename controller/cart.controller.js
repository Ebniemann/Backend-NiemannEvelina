
import mongoose from "mongoose";
import { CartService } from "../services/cart.service.js";
import { ProductService } from "../Services/product.service.js";
import { STATUS_CODE } from "../errors/tiposError.js";
import { TicketService } from "../services/ticket.service.js";
import { sendEmail } from "../mailer/index.js";

export class CartController {
  static async getCart(req, res) {
    try {
      const cart = await CartService.getCart();
      if (!cart) {
        throw new CustomError(
          "CustomError",
          "CartController - getCart - No hay carrito en la BD",
          STATUS_CODE.NOT_FOUND,
          errorBdCart()
        );
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
      });
    }
  }

  static async postCart(req, res) {
    let { name, products } = req.body;

    try {
      const productIds = products.map(
        (pid) => new mongoose.Types.ObjectId(pid)
      );
      const usuario = await usuarioModels.findById(req.usuario._id);
      if (usuario.rol === "premium") {
        const ownedProducts = await ProductService.getOwnedProducts(
          usuario._id,
          productIds
        );
        if (ownedProducts.length > 0) {
          throw new CustomError(
            "CustomError",
            "CartController - postCart - Un usuario premium no puede agregar sus propios productos al carrito.",
            STATUS_CODE.FORBIDDEN,
            ""
          );
        }
      }

      const newCart = await CartService.createCart(name, productIds);

      res.status(200).json({ newCart });
    } catch (error) {
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
        details: error.message,
      });
    }
  }

  static async putCart(req, res) {
    const currentUser = req.user;
    const { cid, pid, quantity } = req.params;

    try {
      if (
        currentUser.rol === "premium" &&
        product.owner.equals(currentUser._id)
      ) {
        throw new CustomError(
          "CustomError",
          "CartController - putCart - Un usuario premium no puede agregar a su carrito un producto que le pertenece",
          STATUS_CODE.FORBIDDEN,
          ""
        );
      }

      const updateCart = await CartService.updateCart(cid, pid, quantity);
      res.status(201).json(updateCart);
    } catch (error) {
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
        details: error.message,
      });
    }
  }

  static async deleteProductCart(req, res) {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.setHeader("Content-type", "application/json");
      return res.status(400).json({ error: "Ingrese un id válido." });
    }

    try {
      const result = await CartService.deleteProductCart(cid, pid);
      if (!result) {
        throw new CustomError(
          "CustomError",
          "CartController - deleteProductCart - No se pudo eliminar el producto del carrito",
          STATUS_CODE.NOT_FOUND,
          errorDeletePC(cid, pid)
        );
      }
      res.status(200).json({ message: "Producto eliminado del carrito exitosamente" });
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: "Error del lado del servidor" });
    }
  }

  static async deleteCart(req, res) {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.setHeader("Content-type", "application/json");
      return res
        .status(400)
        .json({ error: "Ingrese un ID válido para el carrito." });
    }

    try {
      const result = await CartService.deleteCart(cid);
      if (!result) {
        throw new CustomError(
          "CustomError",
          "CartController - deleteCart - No se pudo eliminar el carrito",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoCart(cid)
        );
      }

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        payload: result,
      });
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: "Error del lado del servidor",
      });
    }
  }

  static async purchaseCart(req, res) {
    try {
        const { cid } = req.params;

        const cart = await CartService.getCartById(cid);
     
        function ticketCode() {
          const timestamp = Date.now().toString();
          const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          return `${timestamp}-${randomNumber}`;
      }
        let totalAmount = 0;

        for (const item of cart.carrito) {
          try {
              const product = await ProductService.getProductById(item.producto);
              const productPrice = await ProductService.getProductPrice(product);
              totalAmount += productPrice * item.quantity;
          } catch (error) {
              console.error("Error retrieving product:", error);
          }
      }

        const successfulProducts = [];
        const unsuccessfulProducts = [];

     
        for (const item of cart.carrito) {
            const product = await ProductService.getProductById(item.producto);
            console.log(product)
            if (product.stock >= item.quantity) {
                successfulProducts.push(product);
            } else {
                unsuccessfulProducts.push(product);
            }
        }

        const ticketData = {
            code: ticketCode(),
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: req.user.email
        };

        const newTicket = await TicketService.createTicket(ticketData);
        const formattedDate = newTicket.purchase_datetime.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });


        const emailInfo = await sendEmail({
          to: req.user.email,
          subject: 'Compra exitosa',
          message: `¡Gracias por tu compra! Tu ticket de compra es: ${newTicket.code}. Puedes ver los detalles en tu perfil.`
      });

        res.render('ticket', {
          ticket: { code: newTicket.code, purchase_datetime: formattedDate },
          user: req.user.email,
          amount: totalAmount,
          successfulProducts: successfulProducts.map(product => ({ title: product.title, quantity: product.quantity })),
          unsuccessfulProducts: unsuccessfulProducts.map(product => ({ title: product.title, quantity: product.quantity })),
      });
    } catch (error) {
        res.status(500).json({ error: "no se creo el ticket" });
    }
 }
}
