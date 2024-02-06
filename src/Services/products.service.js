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
      const product = await ProductDao.findProductById(id);
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

  static async updateProduct(id, updatedData) {
    try {
      return await ProductDao.updateProduct(id, updatedData);
    } catch (error) {
      `Error en la actualizacion del producto: ${error.message}`;
    }
  }

  static async deletedProduct(id) {
    try {
      const existingProduct = await ProductDao.findProductById(id);
      if (!existingProduct) {
        throw new Error(`No existe un producto con ese ID: ${id}`);
      }
      const result = await ProductDao.deletedProductById(id);
      if (result.deletedCount > 0) {
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ payload: "Eliminación exitosa" });
      } else {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: "No se puedo eliminar el producto" });
      }
    } catch (error) {
      throw new Error(
        `Error en el servicio al eliminar el producto: ${error.message}`
      );
    }
  }
}
