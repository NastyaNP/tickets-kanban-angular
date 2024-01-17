import { Project } from "./project.model";


export interface TicketComponent {
    id: number;
    name: string;
    description: string;
    project: Project | Project["id"];
    createdAt: string;
    updatedAt: string;
}
