import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { Project } from "../../../models/projects/project.model";
import { SearchComponent } from "../../kanban-board/search/search.component";
import { ProjectUsersComponent } from "../project-users/project-users.component";
import { KanbanBoardComponent } from "../../kanban-board/kanban-board.component";
import { TuiBlockStatusModule } from "@taiga-ui/layout";
import { NgOptimizedImage } from "@angular/common";
import { TuiAlertService, TuiButtonModule } from "@taiga-ui/core";
import { TuiIconModule } from "@taiga-ui/experimental";
import { ActivatedRoute } from "@angular/router";
import { isFunction } from "rxjs/internal/util/isFunction";
import { User } from "../../../models/users/user.model";

@Component({
    selector: "app-project-info",
    standalone: true,
    imports: [
        SearchComponent,
        ProjectUsersComponent,
        KanbanBoardComponent,
        TuiBlockStatusModule,
        NgOptimizedImage,
        TuiButtonModule,
        TuiIconModule
    ],
    templateUrl: "./project-info.component.html",
    styleUrl: "./project-info.component.less"
})
export class ProjectInfoComponent {
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    @Input({ required: true }) project!: Project | null;

    @Output() editProject: EventEmitter<Project> = new EventEmitter<Project>();
    @Output() inviteUsers: EventEmitter<User[]> = new EventEmitter<User[]>();

    public writeLinkToClipboard(): void {
        if (!isFunction(navigator.clipboard.write)) {
            this.alerts
                .open("Your browser doesn't support copying to clipboard.", { label: "Browser can't do that :(", status: "error" })
                .subscribe();
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.alerts.open("Link copied to clipboard.", { label: "Copied!", status: "success" }).subscribe();
            });
        }
    }
}
