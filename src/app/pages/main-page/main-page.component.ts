import { Component, inject, OnInit } from "@angular/core";
import { ProjectInfoComponent } from "../../components/projects/project-info/project-info.component";
import { ProjectsListComponent } from "../../components/projects/projects-list/projects-list.component";
import { ProjectsStore } from "./store/projects.store";
import { CommonModule } from "@angular/common";
import { Project } from "../../models/projects/project.model";
import { CreateProjectPayload } from "../../models/payloads/project/create-project.payload";
import { ProjectFormComponent } from "../../components/projects/project-form/project-form.component";
import { TuiDialogModule } from "@taiga-ui/core";
import { EditProjectPayload } from "../../models/payloads/project/edit-project.payload";
import { TuiLetModule } from "@taiga-ui/cdk";
import { User } from "../../models/users/user.model";

@Component({
    selector: "app-main-page",
    standalone: true,
    imports: [
        ProjectInfoComponent,
        ProjectsListComponent,
        CommonModule,
        ProjectFormComponent,
        TuiDialogModule,
        TuiLetModule
    ],
    templateUrl: "./main-page.component.html",
    styleUrl: "./main-page.component.less",
    providers: [ProjectsStore]
})
export class MainPageComponent implements OnInit {
    private readonly projectsStore = inject(ProjectsStore);

    public readonly projects$ = this.projectsStore.projects$;
    public readonly loading$ = this.projectsStore.loading$;
    public readonly formLoading$ = this.projectsStore.creationInProgress$;
    public readonly currentProject$ = this.projectsStore.currentProject$;

    public editingProject: Project | null = null;
    public isEditingProjectPopupShown: boolean = false;

    public ngOnInit(): void {
        this.projectsStore.loadProjects();
    }

    public onCreateProject(payload: CreateProjectPayload) {
        this.projectsStore.createProject(payload);
    }

    public openEditProjectPopup(editingProject: Project) {
        this.editingProject = editingProject;
        this.isEditingProjectPopupShown = true;
    }

    public onEditProject(payload: Omit<EditProjectPayload, "id">, editingProject: Project) {
        this.editingProject = null;
        this.projectsStore.editProject({
            ...payload,
            id: editingProject.id
        });

    }

    public onDeleteProject(project: Project): void {
        this.projectsStore.deleteProject(project.id);
    }

    public onInviteUsersToProject(usersToInvite: User[], project: Project) {
        this.onEditProject({
            users: [...project.users ?? [], ...usersToInvite]
        }, project)
    }
}
