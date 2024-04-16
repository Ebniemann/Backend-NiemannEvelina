import { TicketService } from "../services/ticket.service.js";


export class TicketController{

  static async getTicket(req,res){
   try {
    const { ticketId } = req.params;
    const ticket = await TicketService.getTicket(ticketId);
    res.render("ticket", { ticket });
  } catch (error) {
    console.error('Error al obtener el ticket:', error);
    res.status(500).json({ error: "Error inesperado del lado del servidor" });
  }
}



}
