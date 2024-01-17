import { TicketPriorities } from "../../tickets/ticket-priorities.enum";
import { TicketTypes } from "../../tickets/ticket-types.enum";
import { Project } from "../../projects/project.model";
import { User } from "../../users/user.model";


export interface CreateTicketPayload {
    name: string;
    description: string;
    assignee: User;
    priority: TicketPriorities;
    type: TicketTypes;
    project: Project["name"],
}
