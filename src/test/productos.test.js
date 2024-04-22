import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import mongoose from "mongoose";

await mongoose.connect(
  "mongodb+srv://ebelen89:coderapp@cluster0.lskftra.mongodb.net/?retryWrites=true&w=majority"
);

const requester = supertest("http//localhost:8080");

describe("Prueba Productos", async function () {
  this.timeout(6000);

  it("Ruta /api/products/:id, en su metodo GET, nos trae un producto por ID", async function () {
    let id = "6579198ca55b4d866f57da06";
    let { statusCode, body, ok } = await requester.get(`/api/products/${id}`);
    expect(statusCode).to.be.equal(200);
    expect(body.payload._id).to.be.exist;
    expect(ok).to.be.true;
  });

  it("Ruta /api/products, en su metodo POST, crea un nuevo producto", async function () {
    let productoTest = {
      title: "PruenaProducto",
      description: "prueba",
      code: 900,
      price: 100,
      stock: 2,
      category: "prueba",
    };

    let respuesta = await requester.post("/api/products").send(productoTest);

    expect(respuesta.statusCode).to.be.equal(200),
      expect(respuesta.ok).to.be.true,
      expect(respuesta.body).to.be.an("object");
    expect(respuesta.body.payload).to.have.property("title");
    expect(respuesta.body.payload).to.have.property("price");
  });

  it("Ruta api/products, en su metodo DELETE, elimina un producto por ID", async function () {
    let id = "6579198ca55b4d866f57da06";
    let respuesta = await requester.delete(`/api/products/${id}`);
    expect(respuesta.statusCode).to.be.equal(200);
    expect(respuesta.ok).to.be.true;
  });
});
