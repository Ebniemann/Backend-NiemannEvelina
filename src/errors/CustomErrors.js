export class CustomErrors {
  static CustomErrors(nombre, mensaje, statusCode, descripcion) {
    let error = new Error(mensaje);
    error.name = nombre;
    error.code = statusCode;
    error.description = descripcion;

    return error;
  }
}
