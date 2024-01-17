import { Component, EventEmitter, Output } from "@angular/core";
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule } from "@taiga-ui/core";
import { TuiDataListDropdownManagerModule } from "@taiga-ui/kit";
import { TuiActiveZoneModule } from "@taiga-ui/cdk";
import { ContextMenuComponent } from "../../../abstract/context-menu.abstract-component";
import { TuiIconModule } from "@taiga-ui/experimental";

@Component({
    selector: "app-project-actions",
    standalone: true,
    imports: [
        TuiButtonModule,
        TuiHostedDropdownModule,
        TuiDataListModule,
        TuiDataListDropdownManagerModule,
        TuiActiveZoneModule,
        TuiIconModule
    ],
    templateUrl: "./project-actions.component.html",
    styleUrl: "./project-actions.component.less"
})
export class ProjectActionsComponent extends ContextMenuComponent {

    @Output() projectDelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() projectEdit: EventEmitter<void> = new EventEmitter<void>();

}
