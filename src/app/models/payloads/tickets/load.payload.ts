import { Project } from "../../projects/project.model";

export interface LoadPayload {
    search: string;
    project: Project | null;
}
