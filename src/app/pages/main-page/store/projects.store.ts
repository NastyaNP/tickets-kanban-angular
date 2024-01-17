import { Project } from "../../../models/projects/project.model";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, finalize, map, Observable, switchMap, tap } from "rxjs";
import { inject } from "@angular/core";
import { ProjectsService } from "../../../services/projects.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Data } from "@angular/router";
import { CreateProjectPayload } from "../../../models/payloads/project/create-project.payload";
import { EditProjectPayload } from "../../../models/payloads/project/edit-project.payload";

export interface ProjectsState {
    projects: Project[];
    loading: boolean;
    creationInProgress: boolean;
}

export class ProjectsStore extends ComponentStore<ProjectsState> {
    private readonly projectsService = inject(ProjectsService);
    private readonly activatedRoute = inject(ActivatedRoute);

    public readonly projects$ = this.select(state => state.projects);
    public readonly loading$ = this.select(state => state.loading);
    public readonly creationInProgress$ = this.select(state => state.creationInProgress);

    public readonly currentProject$: Observable<Project> = this.activatedRoute.data.pipe(
        map((routeData: Data) => routeData["project"]),
        switchMap((project: Project) => this.projects$.pipe(
            map((projects: Project[]) => projects.find((p: Project) => p.id === project.id) ?? project),
        )),
    );

    public readonly setProjects = this.updater((state, projects: Project[]) => ({
        ...state,
        projects,
    }));

    public readonly setLoading = this.updater((state, loading: boolean) => ({
        ...state,
        loading,
    }));

    public readonly setCreationInProgress = this.updater((state, creationInProgress: boolean) => ({
        ...state,
        creationInProgress,
    }));

    public readonly loadProjects = this.effect((trigger$: Observable<void>) => trigger$.pipe(
        switchMap(() => {
            this.setLoading(true);
            return this.projectsService.getProjects().pipe(
                tapResponse(
                    (projects: Project[]) => this.setProjects(projects),
                    (error: HttpErrorResponse) => console.error("Error when fetching projects:",error),
                    () => this.setLoading(false),
                ),
            );
        }),
    ));

    public readonly createProject = this.effect((payload$: Observable<CreateProjectPayload>) => payload$.pipe(
        tap(() => this.setCreationInProgress(true)),
        exhaustMap((payload: CreateProjectPayload) => this.projectsService.createProject(payload).pipe(
            tapResponse(
                () => this.loadProjects(),
                (error: HttpErrorResponse) => console.error("Error when creating project:", error),
            ),
            finalize(() => this.setCreationInProgress(false)),
        )),
    ));

    public readonly editProject = this.effect((payload$: Observable<EditProjectPayload>) => payload$.pipe(
        tap(() => this.setCreationInProgress(true)),
        exhaustMap((payload: EditProjectPayload) => this.projectsService.editProject(payload).pipe(
            tapResponse(
                () => this.loadProjects(),
                (error: HttpErrorResponse) => console.error("Error when editing project:", error),
            ),
            finalize(() => this.setCreationInProgress(false)),
        )),
    ));

    public readonly deleteProject = this.effect((projectId$: Observable<Project["id"]>) => projectId$.pipe(
        exhaustMap((projectId: Project["id"]) => this.projectsService.deleteProject(projectId).pipe(
            tapResponse(
                () => this.loadProjects(),
                (error: HttpErrorResponse) => console.error("Error when deleting project:", error),
            ),
        )),
    ));


    constructor() {
        super({
            projects: [],
            loading: false,
            creationInProgress: false,
        })
    }
}
