import { UserService } from "../Services/user.service.js";

export class UserController {
  static async togglePremiumRole(req, res) {
    const { uid } = req.params;
    try {
      const user = await UserService.findUserById(uid);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const newRole = user.rol === "premium" ? "usuario" : "premium";
      const updatedUser = await UserService.updateUserRole(uid, newRole);

      res
        .status(200)
        .json({ message: "Rol de usuario actualizado", user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: "Error al cambiar el rol del usuario" });
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
