import mongoose from "mongoose";

const usuarioEsquema = new mongoose.Schema(
  {
    nombre: String,
    apellido: String,
    edad: Number,
    email: {
      type: String,
      unique: true,
    },
    avatar: String,
    password: String,
    resetToken: String,
    rol: {
      type: String,
      enum: ["usuario", "admin", "premium"],
      default: "usuario",
    },
    documentos: [
      {
        name: { type: String, required: true },
        reference: { type: String, required: true },
      },
    ],
    profile: { type: Object, required: false },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
    conexion: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
);

const loginConnection = mongoose.createConnection(
  "mongodb+srv://ebelen89:coderapp@cluster0.lskftra.mongodb.net/login",
);

const usuarioModels = loginConnection.model("usuarios", usuarioEsquema);
export { usuarioModels, loginConnection };
