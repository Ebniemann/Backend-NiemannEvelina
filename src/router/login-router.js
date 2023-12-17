import { Router } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import { usuarioModels } from "../dao/models/usuario.models.js";

export const router = Router();

router.post("/registro", async (req, res) => {
  let { nombre, apellido, edad, email, contraseña } = req.body;
  if (!nombre || !apellido || !edad || !email || !contraseña) {
    return res.redirect("/registro?error=Complete todos los datos");
  }

  let existe = await usuarioModels.findOne({ email });

  if (existe) {
    return res.redirect(
      `/registro?error= El email ${email} ya se encuentra registrado`
    );
  }
  contraseña = crypto
    .createHmac("sha256", "coder123")
    .update(contraseña)
    .digest("hex");

  let usuario;

  try {
    usuario = await usuarioModels.create({
      nombre,
      apellido,
      edad,
      email,
      contraseña,
    });
    res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`);
  } catch (error) {
    res.redirect(
      `/registro?error= Error inesperado, intente nuevamente en 10 min`
    );
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.redirect("/login?error=Complete todos los datos");
    }

    email = email.trim();

    if (email === "adminCoder@coder.com" && contraseña === "adminCod3r123") {
      req.session.usuario = {
        nombre: "Admin",
        email: "adminCoder@coder.com",
        contraseña: "adminCod3r123",
        rol: "admin",
      };
      console.log("Iniciando sesión como Admin");
      return res.redirect("/producto");
    }

    contraseña = crypto
      .createHmac("sha256", "coder123")
      .update(contraseña)
      .digest("hex");

    let usuario = await usuarioModels.findOne({ email, contraseña });

    if (!usuario) {
      return res.redirect(`/login?error=Datos incorrectos`);
    }

    req.session.usuario = {
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    console.log("Iniciando sesión como Usuario:", usuario);
    res.redirect("/producto");
  } catch (error) {
    console.error("Error en el proceso de inicio de sesión:", error);
    res.redirect("/login?error=Error inesperado, intente nuevamente en 10 min");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.redirect("/login?error=fallo en el logout");
    }
  });

  res.redirect("/login");
});
