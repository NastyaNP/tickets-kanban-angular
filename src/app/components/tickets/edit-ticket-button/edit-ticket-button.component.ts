import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PopupTriggerComponent } from "../../../abstract/popup-trigger.abstract-component";
import { EditTicketPayload } from "../../../models/payloads/tickets/edit-ticket.payload";
import { Ticket } from "../../../models/tickets/tickets.model";
import { PlusButtonComponent } from "../../shared/plus-button/plus-button.component";
import { TicketFormComponent } from "../ticket-form/ticket-form.component";
import { TuiDialogModule } from "@taiga-ui/core";

@Component({
    selector: "app-edit-ticket-button",
    standalone: true,
    imports: [
        PlusButtonComponent,
        TicketFormComponent,
        TuiDialogModule
    ],
    templateUrl: "./edit-ticket-button.component.html",
    styleUrl: "./edit-ticket-button.component.less"
})
export class EditTicketButtonComponent extends PopupTriggerComponent<EditTicketPayload> {
    @Input({ required: true }) formLoading!: boolean | null;
    @Input({ required: true }) ticket!: Ticket;

    @Output() editTicket: EventEmitter<EditTicketPayload> = new EventEmitter<EditTicketPayload>();

    public override onSubmit(formPayload: Omit<EditTicketPayload, "id">): void {
        this.editTicket.emit({
            ...formPayload,
            id: this.ticket.id
        });
    }

}
