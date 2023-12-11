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

cartsSchema.pre("findOne", function () {
  this.populate({
    path: "name carrito.producto",
  });
});

cartsSchema.pre("find", function () {
  this.populate({
    path: "name carrito.producto",
  });
});

export const cartModel = mongoose.model("carts", cartsSchema);
