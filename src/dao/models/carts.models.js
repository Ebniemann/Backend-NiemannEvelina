import mongoose from "mongoose";

const cartsCollection = "carts";
const cartsSchema = mongoose.Schema(
  {
    name: String,
    products: [
      {
        productId: Number,
        title: String,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);

export const cartModel = mongoose.model(cartsCollection, cartsSchema);
