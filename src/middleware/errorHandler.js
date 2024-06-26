export const errorHandler = (error, req, res, next) => {
  if (error) {
    console.log("Error en el middleware errorHandler:", error);
    if (error.code) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(error.code)
        .json({ error: `${error.name}, ${error.message}` });
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: "Error inesperado del lado del servidor, en errorHandler",
      });
    }
  }
  next();
};
