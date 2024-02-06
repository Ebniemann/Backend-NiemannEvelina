import { cartModel } from "./models/carts.models.js";

export class CartDao {
  static async getCart() {
    try {
      return await cartModel.find();
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }
}
