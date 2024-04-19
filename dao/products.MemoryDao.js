import { productsModels } from "../dao/models/products.models.js";

export class ProductDao {
  static async getProducts(query, options) {
    try {
      return await productsModels.paginate(query, options);
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  static async findProductById(id) {
    try {
      return await productsModels.findOne({ _id: id });
    } catch (error) {
      throw new Error(`Error al buscar el producto por ID: ${error.message}`);
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

  static async putProduct(id, updatedData) {
    try {
      const result = await productsModels.findOne({ _id: id }, updatedData, {
        new: true,
      });

      return result;
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  static async deletedProductById(id) {
    try {
      const result = await productsModels.deleteOne({ _id: id });
      return result;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }

  static async getValidaStock(pid) {
    const producto = await productsModels.findById(pid);
    return producto ? producto.stock : 0;
  }

  static async updateStock(id, quantity) {
    const producto = await productsModels.findById(id);

    if (producto) {
      producto.stock -= quantity;
      await producto.save();
    }
  }
}
