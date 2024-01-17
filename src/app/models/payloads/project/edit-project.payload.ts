import { CreateProjectPayload } from "./create-project.payload";
import { Project } from "../../projects/project.model";

export type EditProjectPayload = Partial<CreateProjectPayload> & Pick<Project, "id">
