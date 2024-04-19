import { TicketModel } from "../dao/models/tickets.models.js";

export class TicketService {
  static async crearTicket(ticketData) {
    const ticket = await TicketModel.create(ticketData);
    return ticket;
  }
}
