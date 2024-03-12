import mongoose from "mongoose";

const registroEsquema = new mongoose.Schema(
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
      enum: ["usuario", "admin", "premium"],
      default: "usuario",
    },
  },
  { timestamps: true, strict: false }
);

const loginConnection = mongoose.createConnection(
  "mongodb+srv://ebelen89:coderapp@cluster0.lskftra.mongodb.net/login",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

export const registroModels = loginConnection.model(
  "usuarios",
  registroEsquema
);
