import { productsModels } from "../dao/models/products.models.js";

export class ProductDao {
  static async getProducts(query, options) {
    try {
      return await productsModels.paginate(query, options);
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  static async getProductById(id) {
    try {
      return await productsModels.findOne({ _id: id });
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  }

  static async createProduct(productData) {
    try {
      const existingProduct = await productsModels.findOne({
        deleted: false,
        code: productData.code,
      });

      if (existingProduct) {
        throw new Error("No se puede utilizar el mismo código");
      }

      return await productsModels.create(productData);
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }
}
