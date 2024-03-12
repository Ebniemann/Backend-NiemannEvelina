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
}
