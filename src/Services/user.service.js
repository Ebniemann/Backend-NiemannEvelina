import { usuarioModels } from "../dao/models/usuario.models.js";

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
}
