import { TicketModel } from "../dao/models/tickets.models.js";

export class TicketService {
  static async crearTicket(ticketData) {
    const ticket = await TicketModel.create(ticketData);
    return ticket;
  }

  static async getTicket(ticketId) {
    try {
      const ticket = await TicketModel.findById(ticketId);
      return ticket;
    } catch (error) {
      throw new Error("Error al obtener el ticket: " + error.message);
    }
  }
}
