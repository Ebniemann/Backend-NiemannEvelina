import mongoose from "mongoose";
import { ProductService } from "../Services/product.service.js";
import { STATUS_CODE } from "../errors/tiposError.js";

export class ProductController {
  static async getProduct(req, res) {
    try {
      const limit = 10;
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort === "desc" ? -1 : 1;
      const query = {};

      if (req.query.category) {
        query.category = req.query.category;
      }

      const options = {
        lean: true,
        limit,
        page,
        sort: { price: sort },
      };

      const { docs, totalDocs } = await ProductService.getProducts(
        query,
        options
      );
      const totalPages = Math.ceil(totalDocs / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null;
      const prevPage = hasPrevPage ? page - 1 : null;

      res.status(200).render("producto", {
        products: docs,
        totalPages,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        limit,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Error al obtener productos" });
    }
  }

  static async getProductId(req, res) {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.setHeader("Content-type", "application/json");
      return res.status(400).json({ error: "Ingrese un id válido." });
    }
    try {
      const product = await ProductService.getProductById(id);

      if (!product) {
        throw new CustomError(
          "CustomError",
          "ProductController - getProductId - No se encontro un producto con ese ID",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoProductos(id)
        );
      }
      res.setHeader("content-type", "application/json");
      return res.status(200).json({ payload: product });
    } catch (error) {
      res.setHeader("content-type", "application/json");
      return res.status(500).json({ error: error.message });
    }
  }

  static async postProduct(req, res) {
    let {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (!title || !price) {
      req.logger.log("error", "Falta completar titulo o precio");
      throw new CustomError(
        "CustomError",
        "ProductController - postProduct - Titulo y precio son datos obligatorios",
        STATUS_CODE.NOT_FOUND,
        ""
      );
    }

    try {
      const newProduct = await ProductService.createProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
        owner: req.usuario._id,
      });
      io.emit("nuevoProducto", { nuevoProducto: newProduct });
      res.setHeader("content-type", "application/json");
      return res.status(200).json({ payload: newProduct });
    } catch (error) {
      res.setHeader("content-type", "application/json");
      return res.status(500).json({ error: error.message });
    }
  }

  static async putProduct(req, res) {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(
        "CustomError",
        "No se encontro un producto con ese ID",
        STATUS_CODE.NOT_FOUND,
        errorArgumentoProductos(id)
      );
    }

    const updatedData = req.body;

    try {
      const result = await ProductService.updateProduct(id, updatedData);
      if (!result) {
        throw new CustomError(
          "CustomError",
          "ProductController - putProduct - No se pudo actualizar",
          STATUS_CODE.NOT_FOUND,
          errorUpdateProductos(id, updatedData)
        );
      }
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: result });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(
        "CustomError",
        "ProductController - deleteProduct - No se encontro un producto con ese ID",
        STATUS_CODE.NOT_FOUND,
        errorArgumentoProductos(id)
      );
    }

    try {
      const result = await ProductService.deletedProduct(id);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: result });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: error.message });
    }
  }
}
