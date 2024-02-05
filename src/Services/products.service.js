import { ProductDao } from "../dao/products.MemoryDao.js";

export class ProductService {
  static async getProducts(query, options) {
    try {
      return await ProductDao.getProducts(query, options);
    } catch (error) {
      throw new Error(`Error en el servicio: ${error.message}`);
    }
  }

  static async getProductById(id) {
    try {
      const product = await ProductDao.getProductById(id);
      if (!product) {
        throw new Error(`No existe un producto con ese ${id}`);
      }
      return product;
    } catch (error) {
      throw new Error(`Error en el servicio: ${error.message}`);
    }
  }

  static async createProduct(productData) {
    try {
      return await ProductDao.createProduct(productData);
    } catch (error) {
      throw new Error(
        `Error en el servicio al crear el producto: ${error.message}`
      );
    }
  }
}
