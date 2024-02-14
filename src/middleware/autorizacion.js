export const autorizacion = (rol) => {
  return (req, res, next) => {
    const userRol = req.usuario && req.usuario.rol;

    if (userRol === rol) {
      next();
    } else {
      res.status(403).json({ error: "Permiso denegado" });
    }
  };
};
