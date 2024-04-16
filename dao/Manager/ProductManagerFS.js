import fs from "fs";

export default class ProductManager {
  constructor(ruta) {
    this.path = ruta;
  }
  getProduct() {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  addProduct(
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails
  ) {
    let products = this.getProduct();
    let codeUnique = products.some((prod) => prod.code === code);
    if (
      !codeUnique &&
      title &&
      description &&
      price &&
      code &&
      stock &&
      status &&
      category
    ) {
      if (thumbnails && !thumbnails.match(/\.(jpeg|jpg|gif|png)$/)) {
        return;
      }
      let id = 1;

      if (products.length > 0) {
        id = products[products.length - 1].id + 1;
      }
      products.push({ id, title, description, price, thumbnails, code, stock });

      fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
    }
  }

  saveProduct(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
  }
}

let productManager = new ProductManager("./archivo.json");
productManager.addProduct(
  "Lentes de Sol Mujer",
  "Estos nuevos modelos unisex",
  "1",
  3000,
  true,
  "10",
  "lentes",
  "img/sunglasses.jpg"
);

productManager.addProduct(
  "Lentes de Sol Hombre",
  "Estos nuevos modelos unisex",
  "2",
  4000,
  true,
  "20",
  "lentes",
  "img/sunglasses.jpg"
);
productManager.addProduct(
  "Remeras",
  "Modelos unisex",
  "3",
  40,
  true,
  "20",
  "ropa",
  "img/remeras.jpg"
);
productManager.addProduct(
  "Zapatillas",
  "Modelos unisex",
  "4",
  30,
  true,
  "20",
  "calzado",
  "img/zapatillas.jpg"
);
productManager.addProduct(
  "Zapatos para mujer",
  "Modelos damas",
  "5",
  5000,
  true,
  "20",
  "calzado",
  "img/sunglasses.jpg"
);
productManager.addProduct(
  "Zapatilla infantil",
  "Modelos unisex",
  "6",
  100,
  true,
  "20",
  "calzado",
  "img/zapatilla-infantil.jpg"
);
productManager.addProduct(
  "Mochilas",
  "Modelos unisex",
  "7",
  70,
  true,
  "20",
  "bolsos",
  "img/mochilas.jpg"
);
productManager.addProduct(
  "Carteras",
  "Modelos dama",
  "8",
  90,
  true,
  "20",
  "bolsos",
  "img/cartera.jpg"
);
productManager.addProduct(
  "cinturon hombre",
  "Accesorios masculinos",
  "9",
  80,
  true,
  "20",
  "accesorio",
  "img/accesorio-masculino.jpg"
);
productManager.addProduct(
  "cinturon damas",
  "Accesorio dama",
  "10",
  776,
  true,
  "20",
  "accesorio",
  "img/accesorio-dama.jpg"
);
