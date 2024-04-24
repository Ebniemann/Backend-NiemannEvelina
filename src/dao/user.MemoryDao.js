import { usuarioModels } from "../dao/models/usuario.models.js";

export class UserDao {
  static async getUser() {
    try {
      return usuarioModels.find();
    } catch {
      throw new Error(`Error inesperado del lado del servidor`);
    }
  }

  static async getUserById(id) {
    try {
      return usuarioModels.findById(id);
    } catch {
      throw new Error(`Error inesperado del lado del servidor`);
    }
  }


  static async removeUser() {
    try {
      const fifteenMinutesAgo = new Date();
      fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

      await usuarioModels.deleteMany({ conexion: { $lt: fifteenMinutesAgo } });
    } catch (error) {
      throw new Error("Error al eliminar usuarios inactivos");
    }
  }
}
