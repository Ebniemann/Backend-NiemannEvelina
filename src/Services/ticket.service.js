import { TicketModel } from "../dao/models/tickets.models.js";

export class TicketService {
  static async createTicket(ticketData) {
    const ticket = await TicketModel.create(ticketData);
    return ticket;
  }
}
