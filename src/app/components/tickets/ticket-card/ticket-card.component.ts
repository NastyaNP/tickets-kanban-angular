import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Ticket } from "../../../models/tickets/tickets.model";
import { TicketPriorityComponent } from "../ticket-priority/ticket-priority.component";
import { TicketActionsComponent } from "../ticket-actions/ticket-actions.component";
import { TuiIconModule } from "@taiga-ui/experimental";

@Component({
    selector: "app-ticket-card",
    standalone: true,
    imports: [
        TicketPriorityComponent,
        TicketActionsComponent,
        TuiIconModule
    ],
    templateUrl: "./ticket-card.component.html",
    styleUrl: "./ticket-card.component.less"
})
export class TicketCardComponent {
    @Input({ required: true }) ticket!: Ticket;

    @Output() editTicket: EventEmitter<Ticket> = new EventEmitter<Ticket>();
}
