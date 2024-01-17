import { Ticket } from "../tickets/tickets.model";


export interface Label {
    id: number;
    name: string;
    color: string;
    backgroundColor: string;
    tickets: Ticket[];
}
