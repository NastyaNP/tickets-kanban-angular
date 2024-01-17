import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Ticket } from "../../../models/tickets/tickets.model";
import { TicketStatuses } from "../../../models/tickets/ticket-statuses.enum";
import { concatMap, exhaustMap, finalize, Observable, switchMap, tap } from "rxjs";
import { TicketsService } from "../../../services/tickets.service";
import { inject, Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { TuiAlertService } from "@taiga-ui/core";
import { LoadPayload } from "../../../models/payloads/tickets/load.payload";
import { CreateTicketPayload } from "../../../models/payloads/tickets/create-ticket.payload";
import { EditTicketPayload } from "../../../models/payloads/tickets/edit-ticket.payload";


export interface KanbanState {
    tickets: Ticket[];
    loading: boolean;
    creationInProgress: boolean;
}

@Injectable()
export class KanbanStore extends ComponentStore<KanbanState> {
    private readonly ticketsService: TicketsService = inject(TicketsService);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    public readonly ticketStatuses: TicketStatuses[] = Object.values(TicketStatuses);
    public readonly ticketStatusColorsMap: Map<TicketStatuses, string> = new Map([
        [TicketStatuses.OPEN, "#5030E5"],
        [TicketStatuses.IN_PROGRESS, "#FFA500"],
        [TicketStatuses.IN_REVIEW, "#76A5EA"],
        [TicketStatuses.DONE, "#8BC48A"],
    ]);

    public readonly tickets$ = this.select((state) => state.tickets);
    public readonly loading$ = this.select((state) => state.loading);
    public readonly creationInProgress$ = this.select((state) => state.creationInProgress);


    public readonly setTickets = this.updater((state, tickets: Ticket[]) => ({
        ...state,
        tickets,
    }));

    public readonly addTicket = this.updater((state, ticket: Ticket) => ({
        ...state,
        tickets: [...state.tickets, ticket],
    }));

    public readonly setLoading = this.updater((state, loading: boolean) => ({
        ...state,
        loading,
    }));

    public readonly setCreationInProgress = this.updater((state, creationInProgress: boolean) => ({
        ...state,
        creationInProgress,
    }));

    public readonly updateTicketInStore = this.updater((state, updatedTicket: Ticket) => ({
        ...state,
        tickets: state.tickets.map((ticket: Ticket) => ticket.id === updatedTicket.id ? updatedTicket : ticket)
    }));

    public readonly loadTickets = this.effect((payload$: Observable<LoadPayload>) => payload$.pipe(
        switchMap((payload: LoadPayload) => {
            this.setLoading(true);
            return this.ticketsService.getTickets(payload).pipe(
                tapResponse(
                    (tickets: Ticket[]) => this.setTickets(tickets),
                    (error: HttpErrorResponse) => this.showErrorNotification(error.error.error)
                ),
                finalize(() => this.setLoading(false)),
            )
        }),
    ));

    public readonly createTicket = this.effect((ticket$: Observable<CreateTicketPayload>) => {
        return ticket$.pipe(
            tap(() => this.setCreationInProgress(true)),
            exhaustMap((ticket) => this.ticketsService.createTicket(ticket).pipe(
                tapResponse(
                    (ticket: Ticket) => this.addTicket(ticket),
                    (error: HttpErrorResponse) =>  console.error("Error when creating ticket", error),
                ),
                finalize(() => this.setCreationInProgress(false)),
            )),
        );
    });

    public readonly updateTicket = this.effect((payload$: Observable<EditTicketPayload>) => payload$.pipe(
        concatMap((payload: EditTicketPayload) => {
            this.setLoading(true);
            return this.ticketsService.updateTicket(payload).pipe(
                tapResponse(
                    (updatedTicket: Ticket) => this.updateTicketInStore(updatedTicket),
                    (error) => console.error("Error when updating ticket", error),
                ),
                finalize(() => this.setLoading(false)),
            );
        }),
    ));

    constructor() {
        super({
            tickets: [],
            loading: true,
            creationInProgress: false,
        });
    }

    private showErrorNotification(message: string): void {
        this.alerts.open(message, {
            label: "Error when fetching tickets",
            status: "error",
            autoClose: true,

        });
    }
}
