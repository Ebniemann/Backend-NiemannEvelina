import { usuarioModels } from "../dao/models/usuario.models.js";
import { UserDao } from "../dao/user.MemoryDao.js";

export class UserService {
  static async findUserById(uid) {
    try {
      const user = await usuarioModels.findById(uid);
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
        res.status(400)({ error: "No se encontraron usuarios" });
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
      return deletedUsers;
    } catch (error) {
      throw new Error(
        `Error al obtener la lista de usuarios eliminados: ${error.message}`
      );
    }
  }
}
