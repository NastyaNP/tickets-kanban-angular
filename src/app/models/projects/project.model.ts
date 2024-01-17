import { User } from "../users/user.model";

export interface Project {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    users: User[];
}
