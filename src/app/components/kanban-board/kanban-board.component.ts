import { Component, inject, Input, OnInit } from "@angular/core";
import { TicketListComponent } from "../tickets/ticket-list/ticket-list.component";
import { CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { KanbanStore } from "./store/kanban.store";
import { BehaviorSubject, combineLatest, filter, map, Observable, tap } from "rxjs";
import { Ticket } from "../../models/tickets/tickets.model";
import { TicketStatuses } from "../../models/tickets/ticket-statuses.enum";
import { CommonModule } from "@angular/common";
import { Project } from "../../models/projects/project.model";
import { SearchComponent } from "./search/search.component";
import { processSearchValue } from "../../utils/rxjs/operators/process-search-value.operator";
import { TuiDialogModule, TuiLoaderModule, TuiScrollbarModule } from "@taiga-ui/core";
import { CreateTicketPayload } from "../../models/payloads/tickets/create-ticket.payload";
import { EditTicketPayload } from "../../models/payloads/tickets/edit-ticket.payload";
import { TicketFormComponent } from "../tickets/ticket-form/ticket-form.component";

interface KanbanList {
    status: string;
    color: string;
    showCreateButton: boolean;
    tickets: Ticket[];
}

@Component({
    selector: "app-kanban-board",
    standalone: true,
    imports: [
        CommonModule,
        TicketListComponent,
        CdkDropListGroup,
        CdkDropList,
        SearchComponent,
        TuiScrollbarModule,
        TuiLoaderModule,
        TicketFormComponent,
        TuiDialogModule
    ],
    templateUrl: "./kanban-board.component.html",
    styleUrl: "./kanban-board.component.less",
    providers: [KanbanStore]
})
export class KanbanBoardComponent implements OnInit {
    private readonly kanbanStore: KanbanStore = inject(KanbanStore);

    @Input({ required: true }) set project(project: Project | null) {
        this.project$.next(project);
    }

    public editingTicket: Ticket | null = null;
    public isTicketEditingPopupOpened: boolean = false;

    public projectName$: Observable<string>;
    public readonly connectedLists: string[] = this.kanbanStore.ticketStatuses.map((status: TicketStatuses) => `${status}-drop-list`);
    public readonly loading$: Observable<boolean> = this.kanbanStore.loading$;
    public readonly creationInProgress$: Observable<boolean> = this.kanbanStore.creationInProgress$;

    public readonly ticketLists$: Observable<KanbanList[]> = this.kanbanStore.tickets$.pipe(
        map((tickets: Ticket[]) => {
            return this.kanbanStore.ticketStatuses.map((status: TicketStatuses) => {
                return {
                    status,
                    showCreateButton: status === TicketStatuses.OPEN,
                    color: this.kanbanStore.ticketStatusColorsMap.get(status)!,
                    tickets: tickets.filter((ticket: Ticket) => ticket.status.name === status)
                };
            });
        }),
        tap((lists: KanbanList[]) => console.log({ lists }))
    );


    private readonly searchValue$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    private readonly project$: BehaviorSubject<Project | null> = new BehaviorSubject<Project | null>(null);

    constructor() {
        this.projectName$ = this.project$.pipe(
            filter(Boolean),
            map((project: Project) => project.name),
        );
        console.log({ connectedLists: this.connectedLists });
    }

    public ngOnInit(): void {
        this.kanbanStore.loadTickets(combineLatest({
            search: this.searchValue$.pipe(
                tap(() => this.kanbanStore.setLoading(true)),
                processSearchValue({
                    debounceTime: 500,
                    distinctUntilChanged: true,
                    whenSearchValueNotPassed: () => this.kanbanStore.setLoading(false),
                    whenNotDistinctive: () => this.kanbanStore.setLoading(false),
                }),
            ),
            project: this.project$
        }));
    }


    public onSearchValueChange(searchValue: string) {
        this.searchValue$.next(searchValue);
    }

    public onCreateTicket(payload: CreateTicketPayload): void {
        this.kanbanStore.createTicket(payload);
    }

    public onUpdateTicket(payload: Omit<EditTicketPayload, "id">, editingTicket: Ticket): void {
        this.kanbanStore.updateTicket({ ...payload, id: editingTicket.id });
    }

    public openTicketEditingPopup(editingTicket: Ticket) {
        this.editingTicket = editingTicket;
        this.isTicketEditingPopupOpened = true;
    }

    public hideTicketEditingPopup() {
        this.isTicketEditingPopupOpened = false;
        this.editingTicket = null;
    }

    public onMoveTicket($event: CdkDragDrop<Ticket[], Ticket[], Ticket>, toStatus: TicketStatuses) {
        if ($event.container.id === $event.previousContainer.id) {
            moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
        } else {
            transferArrayItem($event.previousContainer.data, $event.container.data, $event.previousIndex, $event.currentIndex);
            this.kanbanStore.updateTicket({
                id: $event.item.data.id,
                status: toStatus
            });
        }
    }
}
