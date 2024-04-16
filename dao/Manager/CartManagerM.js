import { cartModel } from "../models/carts.models.js";

export class ManagerCart {
  async listarCarritos() {
    try {
      return await cartModel.find().lena();
    } catch (error) {
      console.log("No se encuentran los productos", error);
      return null;
    }
  }

  async obtenerCarritoPorId(cartId) {
    try {
      const carrito = await cartModel
        .findById(cartId)
        .populate("carrito.producto")
        .lean();
      console.log(carrito)
      return carrito
    } catch (error) {
      console.log("No se encuentran los productos", error);
      return null;
    }
  }
}
