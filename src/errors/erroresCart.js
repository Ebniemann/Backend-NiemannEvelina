export const errorArgumentoCart = (cid) => {
  return `
  Error en argumentos:
  Argumento obligatorios:
  -id: id de BD, recibido ${cid}
  Fecha: ${new Date().toUTCString()} 
  `;
};

export const errorDeletePC = (cid, pid) => {
  return `
  Error en argumentos:
  Argumento obligatorios:
  -id y pid: id y pid recibidos.${(cid, pid)}
  Fecha: ${new Date().toUTCString()} 
  `;
};

export const errorBdCart = () => {
  return `
  Error en BD
  Fecha: ${new Date().toUTCString()} 
  `;
};
