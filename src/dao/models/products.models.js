import mongoose from "mongoose";

const productsColloection = "products";
const productEsquema = mongoose.Schema(
  {
    title: String,
    description: String,
    code: { type: Number, unique: true },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: String,
  },
  { timestamps: true }
);

export const productsModels = mongoose.model(
  productsColloection,
  productEsquema
);
