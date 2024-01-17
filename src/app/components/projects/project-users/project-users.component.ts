import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TuiAutoColorModule, TuiAvatarStackModule, TuiIconModule, TuiInitialsModule } from "@taiga-ui/experimental";
import { Project } from "../../../models/projects/project.model";
import { SlicePipe, UpperCasePipe } from "@angular/common";
import { TuiButtonModule } from "@taiga-ui/core";
import { User } from "../../../models/users/user.model";
import { InviteButtonComponent } from "../invite-button/invite-button.component";
import { TuiLetModule } from "@taiga-ui/cdk";

@Component({
    selector: "app-project-users",
    standalone: true,
    imports: [
        TuiAvatarStackModule,
        SlicePipe,
        TuiButtonModule,
        TuiIconModule,
        UpperCasePipe,
        InviteButtonComponent,
        TuiLetModule,
        TuiInitialsModule,
        TuiAutoColorModule
    ],
    templateUrl: "./project-users.component.html",
    styleUrl: "./project-users.component.less"
})
export class ProjectUsersComponent {

    @Input({ required: true }) project!: Project;

    @Output() inviteUsers: EventEmitter<User[]> = new EventEmitter<User[]>();

    get usersLength(): number {
        return this.project.users?.length ?? 0;
    }

}
