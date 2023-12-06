import { productsModels } from "./models/products.models.js";

export class managerProduct {
  async listarProductos() {
    try {
      return await productsModels.find().lean();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
