import { UserService } from "../services/user.service.js";
import { sendEmail } from "../mailer/index.js";

export class UserController {
  static async togglePremiumIfHasDocuments(req, res) {
    const { uid } = req.params;

    try {
      const user = await UserService.findUserById(uid);
      if (!user) {
        throw new CustomError(
          "CustomError",
          "UserService - sendRecoverPasswordEmail - No se encontro los usuario por email",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoUser(uid)
        );
      }
      if (user.rol === "premium") {
        const updatedUser = await UserService.updateUserRole(uid, "usuario");
        return res.status(200).json({
          message: "Usuario actualizado a usuario",
          user: updatedUser,
        });
      } else {
        if (user.documentos.length >= 3) {
          const updatedUser = await UserService.updateUserRole(uid, "premium");
          return res.status(200).json({
            message: "Usuario actualizado a premium",
            user: updatedUser,
          });
        } else {
          return res.status(400).json({
            error:
              "El usuario no tiene suficientes archivos cargados para actualizar a premium",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async updateUserDocumentStatus(req, res) {
    const uid = req.session.userId;
    try {
      const user = await UserService.findUserById(uid);
      if (!user) {
        throw new CustomError(
          "CustomError",
          "UserService - sendRecoverPasswordEmail - No se encontro los usuario por email",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoUser(uid)
        );
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

  static async getUser(req, res) {
    try {
      const users = await UserService.users();
      const data = users.map((user) => ({
        name: user.nombre,
        apellido: user.apellido,
        email: user.email,
      }));
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.removeInactiveUsers();
      const usuariosEliminados = await UserService.getDeletedUsers();
      const message = "Tu cuenta ha sido eliminada debido a inactividad.";
      await sendEmail("Cuenta Eliminada", message, usuariosEliminados);

      res.status(200).json({
        message: `Usuarios eliminados y correos electrónicos enviados`,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
      });
    }
  }
}
