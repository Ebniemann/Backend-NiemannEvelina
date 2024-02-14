import { ticketModel } from "../dao/models/tickets.models.js";

export class TicketService {
  static async crearTicket(ticketData) {
    const ticket = await ticketModel.create(ticketData);
    return ticket;
  }
}
