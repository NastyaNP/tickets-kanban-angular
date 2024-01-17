import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PlusButtonComponent } from "../../shared/plus-button/plus-button.component";
import { PopupTriggerComponent } from "../../../abstract/popup-trigger.abstract-component";
import { CreateTicketPayload } from "../../../models/payloads/tickets/create-ticket.payload";
import { TuiDialogModule } from "@taiga-ui/core";
import { TicketFormComponent } from "../ticket-form/ticket-form.component";

@Component({
    selector: "app-create-ticket-button",
    standalone: true,
    imports: [
        PlusButtonComponent,
        TuiDialogModule,
        TicketFormComponent
    ],
    templateUrl: "./create-ticket-button.component.html",
    styleUrl: "./create-ticket-button.component.less"
})
export class CreateTicketButtonComponent extends PopupTriggerComponent<CreateTicketPayload> {
    @Input({ required: true }) formLoading!: boolean | null;
    @Input({ required: true }) projectName!: string;

    @Output() createTicket: EventEmitter<CreateTicketPayload> = new EventEmitter<CreateTicketPayload>();

    public onSubmit(formPayload: CreateTicketPayload) {
        this.createTicket.emit(formPayload);
    }
}
