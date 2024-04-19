export const errorArgumentoProductos = (id, ...products) => {
  return `
  Error en argumentos:
  Argumento obligatorios:
  -id: id de BD, recibido ${id}
  Fecha: ${new Date().toUTCString()} 
  `;
};

export const errorUpdateProductos = (id, updatedData) => {
  return `
  Error en argumentos:
  Argumento obligatorios:
  -id: id de BD, recibido ${(id, updatedData)}
  Fecha: ${new Date().toUTCString()} 
  `;
};
