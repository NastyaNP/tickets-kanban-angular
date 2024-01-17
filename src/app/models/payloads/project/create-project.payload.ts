import { User } from "../../users/user.model";


export interface CreateProjectPayload {
    name: string;
    description: string;
    users: User[];
}
