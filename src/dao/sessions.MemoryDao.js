import { usuarioModels, loginConnection } from "./models/usuario.models.js";

export class SessionsMemoryDAO {
  constructor() {
    this.usuarioModel = loginConnection.model("usuarios", usuarioModels.schema);
  }

  async get(usuario) {
    return this.usuarioModel.find();
  }

  async getby(email) {
    return this.usuarioModel.findOne({ email });
  }

  async create(usuario) {
    return this.usuarioModel.create(usuario);
  }
}
