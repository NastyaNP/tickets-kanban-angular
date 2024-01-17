import { Component } from '@angular/core';
import { TicketDetailsComponent } from "../../components/tickets/ticket-details/ticket-details.component";

@Component({
  selector: 'app-ticket-details-page',
  standalone: true,
  imports: [
    TicketDetailsComponent
  ],
  templateUrl: './ticket-details-page.component.html',
  styleUrl: './ticket-details-page.component.less'
})
export class TicketDetailsPageComponent {

}
