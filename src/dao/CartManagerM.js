import { cartModel } from "./models/carts.models.js";

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
      return await cartModel.findById(cartId).lean();
    } catch (error) {
      console.log("No se encuentran los productos", error);
      return null;
    }
  }
}
