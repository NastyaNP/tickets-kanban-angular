import { Component, Input, OnInit } from "@angular/core";
import { TicketStatuses } from "../../../models/tickets/ticket-statuses.enum";
import { TicketPriorities } from "../../../models/tickets/ticket-priorities.enum";
import { combineLatest, map, Observable, ReplaySubject, shareReplay } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-ticket-priority",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./ticket-priority.component.html",
    styleUrl: "./ticket-priority.component.less"
})
export class TicketPriorityComponent implements OnInit {
    @Input({ required: true }) set priority(value: TicketPriorities) {
        this.priority$.next(value);
    }

    @Input({ required: true }) set status(value: TicketStatuses) {
        this.status$.next(value);
    }

    public priorityData$!: Observable<{ styleClass: string, displayText: string }>;

    private readonly priority$: ReplaySubject<TicketPriorities> = new ReplaySubject<TicketPriorities>(1);
    private readonly status$: ReplaySubject<TicketStatuses> = new ReplaySubject<TicketStatuses>(1);

    public ngOnInit(): void {
        this.priorityData$ = combineLatest([this.priority$, this.status$]).pipe(
            map(([priority, status]) => {
                const displayText: string = status === TicketStatuses.DONE ? "Completed": priority;
                return {
                    styleClass: `_${displayText.toLowerCase()}`,
                    displayText,
                }
            }),
            shareReplay({ refCount: true, bufferSize: 1 })
        )
    }


}
