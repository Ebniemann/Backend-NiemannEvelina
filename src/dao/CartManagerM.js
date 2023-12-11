import { cartModel } from "./models/carts.models.js";

export class ManagerCart {
  async listarCarritos() {
    try {
      return await cartModel.find().lean();
    } catch (error) {
      console.log("No se carrito de compra", error);
      return null;
    }
  }
}
