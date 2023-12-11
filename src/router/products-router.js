import { Router } from "express";
import mongoose from "mongoose";
import { productsModels } from "../dao/models/products.models.js";

const productRouter = (io) => {
  const router = Router();

  router.get("/", async (req, res) => {
    let product = [];
    try {
      product = await productsModels.find();
      res.status(200).json({ product });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Error inesperado del lado del servidor" });
    }
  });

  router.get("/:id", async (req, res) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.setHeader("Content-type", "application/json");
      return res.status(400).json({ error: "Ingrese un id válido." });
    }

    let existe;
    try {
      existe = await productsModels.findOne({ _id: id });
    } catch (error) {
      res.setHeader("content-type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }

    if (!existe) {
      res.setHeader("COntent-type", "application/json");
      return res
        .status(400)
        .json({ error: `No existe un producto con ese ${id}` });
    }

    res.setHeader("content-type", "application/json");
    return res.status(200).json({ payload: existe });
  });

  router.post("/", async (req, res) => {
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
      res.setHeader("content-type", "application/json");
      return res.status(400).json({
        error: "Titulo y precio son datos obligatorios ",
      });
    }

    let existe = false;

    try {
      existe = await productsModels.findOne({ deleted: false, code });
    } catch (error) {
      res.setHeader("content-type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }

    if (existe) {
      res.setHeader("Content-type", "application/json");
      return res
        .status(400)
        .json({ error: "no se puede utilizar el mismo código" });
    }

    try {
      let newProduct = await productsModels.create({
        title,
        description,
        price,
        code,
        status,
        stock,
        category,
        thumbnails,
      });
      io.emit("nuevoProducto", { nuevoProducto: newProduct });
      res.setHeader("content-type", "application/json");
      return res.status(200).json({ payload: newProduct });
    } catch (error) {
      res.setHeader("content-type", "application/json");
      return res
        .status(400)
        .json({ error: "no se puede utilizar el mismo código" });
    }
  });

  router.put("/:id", async (req, res) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.setHeader("Content-type", "application/json");
      return res.status(400).json({ error: "Ingrese un id válido." });
    }

    let existe;
    try {
      existe = await productsModels.findOne({ _id: id });
    } catch (error) {
      res.setHeader("content-type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }

    if (!existe) {
      res.setHeader("COntent-type", "application/json");
      return res
        .status(400)
        .json({ error: `No existe un producto con ese ${id}` });
    }

    if (req.body._id) {
      res.setHeader("Conten-Type", "application/json");
      return res.status(400).json({ error: `No se puede modificar el "_id"` });
    }

    let newProduct;

    try {
      newProduct = await productsModels.updateOne({ _id: id }, req.body);
      if (newProduct.modifiedCount > 0) {
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ payload: "Modificación exitosa" });
      } else {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "No se realizo la modificación" });
      }
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }
  });

  router.delete("/:id", async (req, res) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.setHeader("Content-type", "application/json");
      return res.status(400).json({ error: "Ingrese un id válido." });
    }

    let existe;
    try {
      existe = await productsModels.findOne({ _id: id });
    } catch (error) {
      res.setHeader("content-type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }

    if (!existe) {
      res.setHeader("COntent-type", "application/json");
      return res
        .status(400)
        .json({ error: `No existe un producto con ese ${id}` });
    }

    try {
      const result = await productsModels.deleteOne({ _id: id });
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
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }
  });
  return router;
};

export default productRouter;
