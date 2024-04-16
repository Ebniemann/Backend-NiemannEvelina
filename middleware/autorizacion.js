export const autorizacion = (AthorizedRoles) => {
  return (req, res, next) => {
    const userRol = req.user && req.user.rol ? req.user.rol : null;

    if (AthorizedRoles.includes(userRol)) {
      next();
    } else {
      res.status(403).json({ error: "Permiso denegado" });
    }
  };
};
