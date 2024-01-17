import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../models/projects/project.model";
import { HttpClient } from "@angular/common/http";
import { BACKEND_URL } from "../tokens/backend-url.token";
import { CreateProjectPayload } from "../models/payloads/project/create-project.payload";
import { EditProjectPayload } from "../models/payloads/project/edit-project.payload";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly apiUrl: string = inject(BACKEND_URL);

    public getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/projects`);
    }

    public getProject(id: string): Observable<Project> {
        return this.http.get<Project>(`${this.apiUrl}/projects/${id}`);
    }

    public createProject(payload: CreateProjectPayload): Observable<Project> {
        return this.http.post<Project>(`${this.apiUrl}/projects`, payload);
    }

    public editProject({ id, ...payload }: EditProjectPayload): Observable<Project> {
        return this.http.patch<Project>(`${this.apiUrl}/projects/${id}`, payload);
    }

    public deleteProject(projectId: Project["id"]): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}`);
    }
}
