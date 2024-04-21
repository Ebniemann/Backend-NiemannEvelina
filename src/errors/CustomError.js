import * as fs from "fs";
import * as path from "path";
import __dirname from "../utils.js";

export class CustomError extends Error {
  constructor(nombre, mensaje, statusCode, descripcion) {
    super(mensaje);
    this.name = nombre;
    this.code = statusCode;
    this.description = descripcion;
    CustomError.logError(this);
  }

  static logError(error) {
    const logFilePath = path.join(__dirname, "logs.txt"); 


    const logMessage = `${new Date().toISOString()} - ${error.message}\n`;

 
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error("Error al guardar el registro:", err);
      } else {
        console.log("Mensaje de registro guardado con éxito.");
      }
    });
  }
}
