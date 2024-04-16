export const errorArgumentoUser = (uid) => {
  return `
  Error en argumentos:
  Argumento obligatorios:
  -User id: id de BD, recibido ${uid}
  Fecha: ${new Date().toUTCString()} 
  `;
};

export const errorArgument = (filters, params) => {
  return `
  Error en argumentos:
  Argumento obligatorios:
  -Parametros recibidos ${(filters, params)}
  Fecha: ${new Date().toUTCString()} 
  `;
};

export const ErrorDataUSer = (email) => {
  return `
  Error en argumentos:
  Argumento obligatorios:
  -Email: Email de BD, recibido ${email}
  Fecha: ${new Date().toUTCString()} 
  `;
};

export const errorBdUser = () => {
  return `
  Error en BD
  Fecha: ${new Date().toUTCString()} 
  `;
};

export const errorBdUserDeleted = () => {
  return `
  Error en BD
  Fecha: ${new Date().toUTCString()} 
  `;
};
