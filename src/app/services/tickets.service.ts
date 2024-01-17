import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Ticket } from "../models/tickets/tickets.model";
import { BACKEND_URL } from "../tokens/backend-url.token";
import { HttpClient } from "@angular/common/http";
import { TicketPriorities } from "../models/tickets/ticket-priorities.enum";
import { TicketTypes } from "../models/tickets/ticket-types.enum";
import { TicketStatuses } from "../models/tickets/ticket-statuses.enum";
import { LoadPayload } from "../models/payloads/tickets/load.payload";
import { CreateTicketPayload } from "../models/payloads/tickets/create-ticket.payload";
import { EditTicketPayload } from "../models/payloads/tickets/edit-ticket.payload";


@Injectable({
    providedIn: "root"
})
export class TicketsService {
    private readonly backendUrl: string = inject(BACKEND_URL);
    private readonly http: HttpClient = inject(HttpClient);


    public getTickets({ search, project }: LoadPayload): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.backendUrl}/tickets`, {
            params: {
                ...search && { search },
                ...project && { projectId: project.id }
            }
        });
    }

    public createTicket(payload: CreateTicketPayload): Observable<Ticket> {
        return this.http.post<Ticket>(`${this.backendUrl}/tickets`, payload);
    }

    public updateTicket({ id, ...payload }: EditTicketPayload): Observable<Ticket> {
        return this.http.patch<Ticket>(`${this.backendUrl}/tickets/${id}`, payload);
    }
}
