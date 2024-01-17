import { CreateTicketPayload } from "./create-ticket.payload";
import { Ticket } from "../../tickets/tickets.model";

export type EditTicketPayload = Partial<CreateTicketPayload> & Pick<Ticket, "id"> & Partial<{
    status: Ticket["status"]["name"];
}>;
