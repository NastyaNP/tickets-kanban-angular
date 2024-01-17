import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Ticket } from "../../../models/tickets/tickets.model";
import { CreateTicketButtonComponent } from "../create-ticket-button/create-ticket-button.component";
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from "@angular/cdk/drag-drop";
import { TicketCardComponent } from "../ticket-card/ticket-card.component";
import { CommonModule } from "@angular/common";
import { CreateTicketPayload } from "../../../models/payloads/tickets/create-ticket.payload";

@Component({
    selector: "app-ticket-list",
    standalone: true,
    imports: [
        CommonModule,
        CreateTicketButtonComponent,
        CdkDrag,
        TicketCardComponent,
        CdkDropList,
        CdkDragPlaceholder
    ],
    templateUrl: "./ticket-list.component.html",
    styleUrl: "./ticket-list.component.less",
})
export class TicketListComponent {
    @Input({ required: true }) status!: string;
    @Input({ required: true }) color!: string;
    @Input({ required: true }) showCreateButton!: boolean;
    @Input({ required: true }) tickets!: Ticket[];
    @Input({ required: true }) formLoading!: boolean | null;
    @Input({ required: true }) projectName!: string;
    @Input({ required: true }) connectedLists!: string[];

    @Output() createTicket: EventEmitter<CreateTicketPayload> = new EventEmitter<CreateTicketPayload>();
    @Output() editTicket: EventEmitter<Ticket> = new EventEmitter<Ticket>();
    @Output() moveTicket: EventEmitter<CdkDragDrop<Ticket[]>> = new EventEmitter<CdkDragDrop<Ticket[]>>();
}
