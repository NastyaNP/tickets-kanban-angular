import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Project } from "../../../models/projects/project.model";
import { CreateProjectButtonComponent } from "../create-project-button/create-project-button.component";
import { ProjectActionsComponent } from "../project-actions/project-actions.component";
import { RouterLink } from "@angular/router";
import { TuiBlockStatusModule } from "@taiga-ui/layout";
import { NgOptimizedImage } from "@angular/common";
import { TuiLoaderModule } from "@taiga-ui/core";
import { CreateProjectPayload } from "../../../models/payloads/project/create-project.payload";

@Component({
    selector: "app-projects-list",
    standalone: true,
    imports: [
        CreateProjectButtonComponent,
        ProjectActionsComponent,
        RouterLink,
        TuiBlockStatusModule,
        NgOptimizedImage,
        TuiLoaderModule
    ],
    templateUrl: "./projects-list.component.html",
    styleUrl: "./projects-list.component.less"
})
export class ProjectsListComponent {
    @Input({ required: true }) projects!: Project[];
    @Input({ required: true }) selectedProject!: Project | null;
    @Input({ required: true }) loading!: boolean | null;
    @Input({ required: true }) formLoading!: boolean | null;

    @Output() createProject: EventEmitter<CreateProjectPayload> = new EventEmitter<CreateProjectPayload>();
    @Output() editProject: EventEmitter<Project> = new EventEmitter<Project>();
    @Output() deleteProject: EventEmitter<Project> = new EventEmitter<Project>();
}
