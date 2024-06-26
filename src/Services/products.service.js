import { ProductDao } from "../dao/products.MemoryDao.js";
import { CustomError } from "../Errors/CustomError.js";
import { STATUS_CODE } from "../errors/tiposError.js";
import { errorArgumentoProductos } from "../errors/erroresProducto.js";

export class ProductService {
  static async getProducts(query, options) {
    try {
      return await ProductDao.getProducts(query, options);
    } catch (error) {
      throw new CustomError(
        "CustomError",
        "ProductService - getProduct - Error inesperado del lado del servidor",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  static async getProductById(id) {
    try {
      const product = await ProductDao.findProductById(id);
      if (!product) {
        throw new CustomError(
          "CustomError",
          "ProductService - getProductById - No se encontro un producto con ese ID",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoProductos(id)
        );
      }
      return product;
    } catch (error) {
      throw new CustomError(
        "CustomError",
        "ProductService - getProductById - Error inesperado del lado del servidor",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        error
   ) }
  }

  static async createProduct(productData) {
    try {
      return await ProductDao.createProduct(productData);
    } catch (error) {
      throw new CustomError(
        "CustomError",
        "ProductService - createProduct - No se pudo crear el producto",
        STATUS_CODE.ERROR_BAD_REQUEST,
        error
      );
    }
  }

  static async updateProduct(id, updatedData) {
    try {
      return await ProductDao.updateProduct(id, updatedData);
    } catch (error) {
      throw new CustomError(
        "CustomError",
        "ProductService - updateProduct - No se pudo actualizar el producto",
        STATUS_CODE.ERROR_BAD_REQUEST,
        errorArgumentoProductos(id)
      );
    }
  }

  static async deletedProduct(id) {
    try {
      const existingProduct = await ProductDao.findProductById(id);
      if (!existingProduct) {
        throw new CustomError(
          "CustomError",
          "ProductService - deletedProduct - No se encontro un producto con ese ID",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoProductos(id)
        );
      }
      const result = await ProductDao.deletedProductById(id);
      if (result.deletedCount > 0) {
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ payload: "Eliminación exitosa" });
      } else {
        throw new CustomError(
          "CustomError",
          "ProductService - deletedProduct - No se pudo eliminar el producto",
          STATUS_CODE.ERROR_BAD_REQUEST,
          errorArgumentoProductos(id)
        );
      }
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }
  }

  static async getOwnedProducts(userId, pid) {
    try {
      const currentUser = await usuarioModels.findById(userId);

      const ownedProducts = await ProductDao.getProducts({
        _id: { $in: pid },
        owner: currentUser.email,
      });

      return ownedProducts;
    } catch (error) {
      Error(
        `Error al obtener productos propiedad del usuario: ${error.message}`
      );
    }
  }

  static async getProductPrice(productId) {
    try {
      const product = await ProductDao.findProductById(productId);
      if (!product) {
        throw new Error("El producto no existe");
      }

      return product.price;
    } catch (error) {
      throw new Error("Error al obtener el precio del producto");
    }
}
}
