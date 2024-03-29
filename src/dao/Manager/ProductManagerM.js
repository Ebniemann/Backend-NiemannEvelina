import { productsModels } from "../models/products.models.js";

export class ManagerProduct {
  async listarProductos() {
    try {
      return await productsModels.find().lean();
    } catch (error) {
      console.log("No se encuentran los productos", error);
      return null;
    }
  }
}
