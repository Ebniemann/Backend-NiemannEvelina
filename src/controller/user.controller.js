import { UserService } from "../Services/user.service.js";

export class UserController {
  static async togglePremiumIfHasDocuments(req, res) {
    const { uid } = req.params;

    try {
      const user = await UserService.findUserById(uid);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Verificar si el usuario tiene 3 archivos cargados
      if (user.documentos.length >= 3) {
        // Si tiene 3 archivos cargados, actualizar el rol a premium
        const updatedUser = await UserService.updateUserRole(uid, "premium");
        return res
          .status(200)
          .json({
            message: "Usuario actualizado a premium",
            user: updatedUser,
          });
      } else {
        return res
          .status(400)
          .json({
            error:
              "El usuario no tiene suficientes archivos cargados para actualizar a premium",
          });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async updateUserDocumentStatus(req, res) {
    const uid = req.session.userId;
    console.log("Valor de req.session.userId:", req.session.userId);
    try {
      const user = await UserService.findUserById(uid);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      user.documentos = Object.keys(req.files).map((fieldname) => ({
        name: req.files[fieldname][0].originalname,
        reference: req.files[fieldname][0].filename,
      }));

      await UserService.saveUser(user);

      return res
        .status(200)
        .json({ message: "Documentos cargados exitosamente" });
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
