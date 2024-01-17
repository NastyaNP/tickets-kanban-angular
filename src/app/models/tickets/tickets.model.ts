import { User } from "../users/user.model";
import { Project } from "../projects/project.model";
import { DictionaryItem } from "../dictionaries/dictionary-item.model";
import { TicketComponent } from "../projects/component.model";
import { Label } from "../labels/label.model";
import { TicketStatuses } from "./ticket-statuses.enum";
import { TicketPriorities } from "./ticket-priorities.enum";
import { TicketTypes } from "./ticket-types.enum";


export interface Ticket {
    id: number;
    name: string;
    description: string;
    assignee: User;
    reporter: User;
    comments: Comment[];
    labels: Label[];
    components: TicketComponent[];
    dueDate: string;
    status: DictionaryItem<TicketStatuses>;
    type: DictionaryItem<TicketTypes>;
    priority: DictionaryItem<TicketPriorities>;
    project: Project;
    createdAt: string;
    updatedAt: string;
}
