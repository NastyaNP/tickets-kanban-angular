import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { Project } from "../models/projects/project.model";
import { inject } from "@angular/core";
import { ProjectsService } from "../services/projects.service";

export const projectResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project | null> => {
    const projectsService = inject(ProjectsService);
    const projectId = route.paramMap.get("id");
    return projectId ? projectsService.getProject(projectId) : of(null);
};
