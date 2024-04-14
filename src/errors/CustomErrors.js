import * as fs from "fs";
import * as path from "path";
import __dirname from "../utils.js";

export class CustomError extends Error {
  constructor(nombre, mensaje, statusCode, descripcion) {
    super(mensaje);
    this.name = nombre;
    this.code = statusCode;
    this.description = descripcion;
  }

  static registerError(name, message, statusCode, description) {
    let error = new Error(message);
    error.date = new Date();
    error.name = name;
    error.code = statusCode;
    error.message = message;
    error.description = description;
    this.logError(error);
    return error;
  }

  static logError(error) {
    const logFilePath = path.join(__dirname, "logs.txt"); // Ruta del archivo de registro

    // Formato del mensaje de registro con la fecha y hora actual
    const logMessage = `${new Date().toISOString()} - ${error.message}\n`;

    // Escribir el message de registro en el archivo
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error("Error al guardar el registro:", err);
      } else {
        console.log("Mensaje de registro guardado con éxito.");
      }
    });
  }
}
