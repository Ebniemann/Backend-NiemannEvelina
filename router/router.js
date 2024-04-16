import { Router } from "express";
import { passportCall } from "../utils.js";
export class MiRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  init() { }

  getRouter() {
    return this.router;
  }

  get(ruta, permisos, ...funciones) {
    this.router.get(
      ruta,
      this.misRespuestas,
      passportCall("jwt"),
      this.acceso(permisos),
      this.agregaTryCatch(funciones)
    );
  }

  post(ruta, permisos, ...funciones) {
    this.router.post(
      ruta,
      this.misRespuestas,
      ruta !== "/login" && ruta !== "/signup"
        ? passportCall("jwt")
        : (req, res, next) => {
          next();
        },
      this.acceso(permisos),
      this.agregaTryCatch(funciones)
    );
  }

  misRespuestas = (req, res, next) => {
    res.success = (respuesta) =>
      res.status(200).json({ status: "OK", respuesta });
    res.successAlta = (respuesta, itemNuevo) =>
      res.status(201).json({ status: "OK", respuesta, itemNuevo });
    res.errorCliente = (error) =>
      res.status(400).json({ status: "Bad Request", error });
    res.errorServer = (error) =>
      res.status(500).json({ status: "Server Error", error });
    res.errorAuth = (error) =>
      res.status(401).json({ status: "Auth Error", error });
    res.errorPermidos = (error) =>
      res.status(403).json({ status: "Permisos incorrectos", error });
    next();
  };

  agregaTryCatch(funciones) {
    return funciones.map((funcion) => {
      return async (...params) => {
        try {
          funcion.apply(this, params);
        } catch (error) {
          params[1].errorServer(
            "Error inesperado. Contacte al administrador. Detalle: " +
            error.message
          );
        }
      };
    });
  }

  acceso(permisos = []) {
    return (req, res, next) => {
      permisos = permisos.map((p) => p.toLowerCase());

      if (permisos.includes("public")) {
        return next();
      }

      if (!req.user || !req.user.rol) {
        return res.errorAuth("No hay usuarios logueados");
      }

      if (!permisos.includes(req.user.rol.toLowerCase())) {
        return res.errorPermidos(
          "No tiene privilegios suficientes para acceder a este recurso... :("
        );
      }

      return next();
    };
  }
}
