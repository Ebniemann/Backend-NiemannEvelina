export const autorizacion = (rol) => {
  return (req, res, next) => {
    const userRol = req.user && req.user.rol;

    if (userRol === rol) {
      next();
    } else {
      res.status(403).json({ error: "Permiso denegado" });
    }
  };
};
