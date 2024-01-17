import { Component, EventEmitter, Output } from "@angular/core";
import { TuiIconModule } from "@taiga-ui/experimental";
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule } from "@taiga-ui/core";
import { TuiDataListDropdownManagerModule } from "@taiga-ui/kit";
import { TuiActiveZoneModule } from "@taiga-ui/cdk";
import { ContextMenuComponent } from "../../../abstract/context-menu.abstract-component";

@Component({
    selector: "app-ticket-actions",
    standalone: true,
    imports: [
        TuiIconModule,
        TuiButtonModule,
        TuiHostedDropdownModule,
        TuiDataListDropdownManagerModule,
        TuiDataListModule,
        TuiActiveZoneModule
    ],
    templateUrl: "./ticket-actions.component.html",
    styleUrl: "./ticket-actions.component.less"
})
export class TicketActionsComponent extends ContextMenuComponent {
    @Output() ticketEdit: EventEmitter<void> = new EventEmitter<void>();
}
