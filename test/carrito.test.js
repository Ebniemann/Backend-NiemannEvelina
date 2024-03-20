import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import mongoose from "mongoose";

await mongoose.connect(
  "mongodb+srv://ebelen89:coderapp@cluster0.lskftra.mongodb.net/?retryWrites=true&w=majority"
);

const requester = supertest("http//localhots:8080");

describe("Prueba carrito", async function () {
  this.timeout(6000);
});
