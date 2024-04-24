import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import mongoose from "mongoose";

await mongoose.connect(
  "mongodb+srv://ebelen89:coderapp@cluster0.lskftra.mongodb.net/?retryWrites=true&w=majority"
);

const requester = supertest("http//localhots:8080");

describe('Pruebas de los endpoints del carrito', () => {
  it('Ruta api/cart/:cid Debería obtener el carrito por id', async () => {
   let cid= "65eee5cbd6fe86130c044c37";
   let { statusCode, body, ok } = await requester.get(`/api/products/${cid}`);
   expect(statusCode).to.be.equal(200);
   expect(body.payload._id).to.be.exist;
   expect(ok).to.be.true;
      
    expect(res.body).to.be.an('array');
  });

  it('Debería crear un nuevo carrito correctamente', async () => {
    const res = await request(app)
      .post('/')
      .send({ name: 'Nuevo carrito', products: ['id_producto_1', 'id_producto_2'] })
      .expect(200);

    expect(res.body).to.have.property('newCart');
  });

  it('Debería agregar un producto al carrito correctamente', async () => {
    const res = await request(app)
      .put('/:cid/product/:pid/:quantity')
      .send({ cid: 'id_carrito', pid: 'id_producto', quantity: 1 }) 
      .expect(201);

    expect(res.body).to.have.property('updatedCart');
  });

  it('Debería eliminar un producto del carrito correctamente', async () => {
    const res = await request(app)
      .delete('/:cid/product/:pid')
      .send({ cid: 'id_carrito', pid: 'id_producto' }) 
      .expect(200);

    expect(res.body).to.have.property('message', 'Eliminación exitosa');
  });

  it('Debería eliminar el carrito correctamente', async () => {
    const res = await request(app)
      .delete('/:cid')
      .send({ cid: 'id_carrito' }) 
      .expect(200);

    expect(res.body).to.have.property('message', 'Eliminacion exitoda del carrito id_carrito');
  });

  it('Debería realizar la compra del carrito correctamente', async () => {
    const res = await request(app)
      .post('/:cid/purchase')
      .send({ cid: 'id_carrito' })
      .expect(200);

    expect(res.body).to.have.property('ticket');
    expect(res.body.ticket).to.have.property('code');
    expect(res.body.ticket).to.have.property('purchase_datetime');
  });
});