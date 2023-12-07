import { chatModels } from "./models/chat.models.js";

export class ManagerChat {
  async obtenerMessage() {
    try {
      return await chatModels.find().sort({ timestamp: 1 }).lean();
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return null;
    }
  }
}
