const { Router } = require("express");
const ProductManager = require("../archivos/ProductManager");

let products = new ProductManager("./archivo.json");
const product = products.getProduct();

console.log("eve", product);

const router = Router();

router.get("/", (req, res) => {
  const everyProducts = product;
  if (req.query.limit === "") {
    res.setHeader("content-type", "application/json");
    return res.status(200).json({ everyProducts });
  } else {
    let result = everyProducts.slice(0, req.query.limit);
    res.setHeader("content-type", "application/json");
    return res.status(200).json({ result });
  }
});

router.get("/:pid", (req, res) => {
  const pid = req.params.pid;
  const prod = product;
  const proId = prod.find((p) => p.id == pid);
  if (!proId) {
    res.setHeader("content-type", "application/json");
    return res
      .status(400)
      .json({ error: "No se encontro un producto con ese Id" });
  } else {
    res.setHeader("content-type", "application/json");
    return res.status(200).json({ proId });
  }
});

router.post("/", (req, res) => {
  let {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    res.setHeader("content-type", "application/json");
    return res.status(400).json({
      error:
        "title, description, code, price, stock y category son datos obligatorios ",
    });
  }

  let prod = product;
  let codUnico = prod.find((p) => p.code === code);
  if (!codUnico) {
    let id = 1;
    if (prod.length > 0) {
      id = prod[prod.length - 1].id + 1;
    }

    newProduct = {
      id,
      title,
      description,
      price,
      code,
      status,
      stock,
      category,
      thumbnails,
    };
    if (thumbnails) {
      newProduct.thumbnails = thumbnails;
    }

    prod.push(newProduct);
    products.saveProduct(prod);
    res.setHeader("content-type", "application/json");
    return res.status(200).json({ newProduct });
  } else {
    res.setHeader("content-type", "application/json");
    return res
      .status(400)
      .json({ error: "no se puede utilizar el mismo código" });
  }
});

router.put("/:pid", (req, res) => {
  let { pid } = req.params;
  pid = parseInt(pid);
  if (isNaN(pid)) {
    res.setHeader("content-type", "application/json");
    return res.status(400).json({ error: "Solo se acepta id numérico" });
  }

  let prod = products.getProduct();
  let prodId = prod.findIndex((p) => p.id === pid);
  if (prodId === -1) {
    res.setHeader("content-type", "application/json");
    return res
      .status(400)
      .json({ error: "No existe ningún producto con ese id" });
  }

  let propiedadesAceptadas = [
    "title",
    "description",
    "price",
    "code",
    "status",
    "stock",
    "category",
    "thumbnails",
  ];

  let propiedadesObtenidas = Object.keys(req.body);
  let propiedades = propiedadesAceptadas.every((prop) =>
    propiedadesObtenidas.includes(prop)
  );

  if (!propiedades) {
    res.setHeader("content-type", "application/json");
    return res.status(400).json({ error: "Propiedades no válidas" });
  }
  let prodCode = product;
  let codUnico = prodCode.find((p) => p.code === req.body.code);
  if (codUnico) {
    res.setHeader("content-type", "application/json");
    return res
      .status(400)
      .json({ error: "ya existe un producto con ese codigo" });
  }

  let prodModifcado = {
    ...prod[prodId],
    ...req.body,
    id: pid,
  };

  prod[prodId] = prodModifcado;
  products.saveProduct(prod);
  res.setHeader("content-type", "application/json");
  return res.status(200).json({ prodModifcado });
});

router.delete("/:pid", (req, res) => {
  let { pid } = req.params;
  pid = parseInt(pid);
  if (isNaN(pid)) {
    res.setHeader("content-type", "application/json");
    return res.status(400).json({ error: "Solo se acepta id numérico" });
  }

  let prod = products.getProduct();
  const prodIndice = prod.findIndex((p) => p.id === pid);
  if (prodIndice !== -1) {
    let productoEliminado = prod.splice(prodIndice, 1);

    products.saveProduct(prod);
    res.setHeader("content-type", "application/json");
    return res.status(200).json({ productoEliminado });
  } else {
    res.setHeader("content-type", "application/json");
    return res
      .status(400)
      .json({ error: "NO SE ENCONTRO UN PRODUCTO CON ESE ID" });
  }
});
module.exports = router;
