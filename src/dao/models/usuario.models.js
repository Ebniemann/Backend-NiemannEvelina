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
    password: String,
    rol: {
      type: String,
      default: "usuario",
    },
  },
  { timestamps: true, strict: false }
);

const loginConnection = mongoose.createConnection(
  "mongodb+srv://ebelen89:coderapp@cluster0.lskftra.mongodb.net/login",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

export const usuarioModels = loginConnection.model("usuarios", usuarioEsquema);
