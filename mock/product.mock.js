import { fakerES_MX as faker } from "@faker-js/faker";

const generaProducto = (cantidad) => {
  let productos = [];
  for (let i = 0; i < cantidad; i++) {
    let title = faker.commerce.productName();
    let description = faker.commerce.productDescription();
    let code = faker.string.alphanumeric(4);
    let price = faker.commerce.price({ min: 1000, max: 10000, symbol: "$" });
    let stock = faker.number.int({ min: 0, max: 20 });
    let status = stock > 0;
    productos.push({ title, description, code, price, stock, status });
  }
  return productos;
};

export default generaProducto;
