import { usuarioModels } from "../dao/models/usuario.models.js";
import { UserDao } from "../dao/user.MemoryDao.js";
import { generaAuthToken, generatePasswordResetToken } from "../utils.js";
import { sendEmail } from "../mailer/index.js";

export class UserService {
  static async findOneAndUpdate(filters, params) {
    try {
      const user = await usuarioModels.findOneAndUpdate(filters, params);
      if (!user) {
        throw new CustomError(
          "CustomError",
          "UserService - findOneAndUpdate - No se pudo actualizar el usuario.",
          STATUS_CODE.ERROR_BAD_REQUEST,
          errorArgument(filters, params)
        );
      }
      return user;
    } catch (error) {
      throw new Error(
        `Error al actualizar el usuario por ID: ${error.message}`
      );
    }
  }

  static async findUserById(uid) {
    try {
      const user = await usuarioModels.findById(uid);
      if (!user) {
        throw new CustomError(
          "CustomError",
          "UserService - findUserById - No se encontro un Usuario con ese ID",
          STATUS_CODE.NOT_FOUND,
          errorArgumentoUser(uid)
        );
      }
      return user;
    } catch (error) {
      throw new Error(`Error al buscar el usuario por ID: ${error.message}`);
    }
  }

  static async updateUserRole(uid, newRole) {
    try {
      const user = await usuarioModels.findByIdAndUpdate(
        uid,
        { $set: { rol: newRole } },
        { new: true }
      );
      return user;
    } catch (error) {
      throw new Error(
        `Error al actualizar el rol del usuario: ${error.message}`
      );
    }
  }

  static async saveUser(user) {
    try {
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      throw new Error(`Error al guardar el usuario: ${error.message}`);
    }
  }

  static async users(res) {
    try {
      const user = await UserDao.getUser();
      if (!user) {
        throw new CustomError(
          "CustomError",
          "UserService - users - No se encontro los usuario en BD",
          STATUS_CODE.NOT_FOUND,
          errorBdUser()
        );
      }
      return user;
    } catch {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: "Error inesperado del lado del servidor" });
    }
  }

  static async removeInactiveUsers() {
    try {
      await UserDao.removeUser();
    } catch (error) {
      throw new Error("Error al eliminar usuarios inactivos desde el servicio");
    }
  }

  static async getDeletedUsers() {
    try {
      const deletedUsers = await usuarioModels.find({ deleted: true });
      if (!deletedUsers) {
        throw new CustomError(
          "CustomError",
          "UserService - getDeletedUsers - No se encontro los usuario eliminado en BD",
          STATUS_CODE.NOT_FOUND,
          errorBdUserDeleted()
        );
      }

      return deletedUsers;
    } catch (error) {
      throw new Error(
        `Error al obtener la lista de usuarios eliminados: ${error.message}`
      );
    }
  }

  static async sendRecoverPasswordEmail(email) {
    try {
      const usuario = await usuarioModels.findOne({ email });

      if (!usuario) {
        return done(null, false, { message: "Correo electrónico no encontrado" });
      }
      const resetToken = generatePasswordResetToken(usuario.email);

      usuario.resetToken = resetToken;
      await usuario.save();

      const mensaje = `Puede restablecer su contraseña desde el siguiente enlace: http://localhost:8080/reset-password?token=${resetToken}`;
      const emailsent = await sendEmail({
        to: usuario.email,
        subject: "Recuperación de contraseña",
        message: mensaje,
      });

      return emailsent;
    } catch (error) {
      throw new Error(`Error al enviar email de recueperación`);
    }
  }

  static async resetUserPassword(email) {
    const user = await usuarioModels.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });

    const resetToken = generatePasswordResetToken(email);
  }
}
}
