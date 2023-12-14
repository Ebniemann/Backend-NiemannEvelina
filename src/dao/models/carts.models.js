import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema(
  {
    name: String,
    carrito: {
      type: [
        {
          producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          quantity: {
            type: Number,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("carts", cartsSchema);
