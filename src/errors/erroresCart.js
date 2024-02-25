export const errorArgumentoCart = (cid, ...carts) => {
  return `
  Error en argumentos:
  Argumento obligatorios:
  -id: id de BD, recibido ${cid}
  Fecha: ${new Date().toUTCString()} 
  `;
};
