import mongoose from "mongoose";
import { productsModels } from "../dao/models/products.models.js";
import { ProductService } from "../services/products.service.js";

export class ProductController {
  static async getProduct(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort === "desc" ? -1 : 1; // -1 para descendente, 1 para ascendente
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

      const product = await ProductService.getProducts(query, options);

      const { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } =
        product;

      res.status(200).render("producto", {
        products: product.docs,
        totalPages,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        limit,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json("error", { error: "Error al obtener productos" });
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
      throw CustomErrors.CustomErrors(
        "Titulo y precio son datos obligatorios",
        STATUS_CODE.NOT_FOUND
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
      throw CustomErrors.CustomErrors(
        "No se encontro un producto con ese ID",
        STATUS_CODE.NOT_FOUND,
        errorArgumentoProductos(id)
      );
    }

    const updatedData = req.body;

    try {
      const result = await ProductService.updateProduct(id, updatedData);
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
      throw CustomErrors.CustomErrors(
        "No se encontro un producto con ese ID",
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
