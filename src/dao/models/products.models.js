import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productEsquema = new mongoose.Schema(
  {
    title: String,
    description: String,
    code: { type: Number, unique: true },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios" },
  },
  { timestamps: true }
);

productEsquema.plugin(paginate);

export const productsModels = mongoose.model("products", productEsquema);
