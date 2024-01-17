import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { Ticket } from "../../../models/tickets/tickets.model";
import { CreateTicketPayload } from "../../../models/payloads/tickets/create-ticket.payload";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TicketPriorities } from "../../../models/tickets/ticket-priorities.enum";
import { TicketTypes } from "../../../models/tickets/ticket-types.enum";
import { User } from "../../../models/users/user.model";
import { AsyncPipe } from "@angular/common";
import { TuiButtonModule, TuiPrimitiveTextfieldModule, TuiTextfieldControllerModule } from "@taiga-ui/core";
import {
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiInputModule,
    TuiMultiSelectModule, TuiSelectModule,
    TuiTextareaModule
} from "@taiga-ui/kit";
import { UsersService } from "../../../services/users.service";
import { BehaviorSubject, map, Observable, switchMap } from "rxjs";
import { TUI_DEFAULT_MATCHER, TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler } from "@taiga-ui/cdk";
import { processSearchValue } from "../../../utils/rxjs/operators/process-search-value.operator";
import { DictionaryService } from "../../../services/dictionary.service";
import { DictionaryItem } from "../../../models/dictionaries/dictionary-item.model";

@Component({
    selector: "app-ticket-form",
    standalone: true,
    imports: [
        AsyncPipe,
        FormsModule,
        ReactiveFormsModule,
        TuiButtonModule,
        TuiDataListWrapperModule,
        TuiInputModule,
        TuiMultiSelectModule,
        TuiPrimitiveTextfieldModule,
        TuiTextareaModule,
        TuiTextfieldControllerModule,
        TuiComboBoxModule,
        TuiSelectModule
    ],
    templateUrl: "./ticket-form.component.html",
    styleUrl: "./ticket-form.component.less"
})
export class TicketFormComponent implements OnInit {
    private readonly usersService: UsersService = inject(UsersService);
    private readonly dictionariesService: DictionaryService = inject(DictionaryService);

    @Input() projectName!: string;
    @Input() loading: boolean | null = false;
    @Input() ticket: Ticket | null = null;

    @Output() submitForm: EventEmitter<CreateTicketPayload> = new EventEmitter<CreateTicketPayload>();
    @Output() cancelled: EventEmitter<void> = new EventEmitter<void>();

    public readonly formGroup = new FormGroup({
        name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
        description: new FormControl("", { nonNullable: true, validators: [] }),
        priority: new FormControl<TicketPriorities>(TicketPriorities.NORMAL, { nonNullable: true, validators: [Validators.required] }),
        type: new FormControl<TicketTypes>(TicketTypes.DEFECT, { nonNullable: true, validators: [Validators.required] }),
        assignee: new FormControl<User | null>(null, { nonNullable: false, validators: [Validators.required] }),
    });

    public readonly users$: Observable<User[]>;
    public readonly types$: Observable<TicketTypes[]>;
    public readonly priorities$: Observable<TicketPriorities[]>;

    public readonly stringifyUser: TuiStringHandler<User | TuiContextWithImplicit<User>> = item => {
        return "username" in item ? item.username : item.$implicit?.username ?? ""
    };
    public readonly usersIdentityMatcher: TuiIdentityMatcher<User> = (user1, user2) =>  user1.id === user2.id;

    constructor() {
        this.users$ = this.usersSearch$.pipe(
            processSearchValue({
                debounceTime: 500,
                distinctUntilChanged: true,
            }),
            switchMap((search: string) => this.usersService.getUsers(search).pipe(
                map((users: User[]) => users.filter((user: User) => TUI_DEFAULT_MATCHER(user, search, this.stringifyUser))),
            )),
        );
        this.priorities$ = this.dictionariesService.getTicketPriorities().pipe(
            map((priorities: DictionaryItem<TicketPriorities>[]) => priorities.map((priority: DictionaryItem<TicketPriorities>) => priority.name))
        );
        this.types$ = this.dictionariesService.getTicketTypes().pipe(
            map((types: DictionaryItem<TicketTypes>[]) => types.map((type: DictionaryItem<TicketTypes>) => type.name))
        );
    }

    public ngOnInit(): void {
        if (this.ticket) {
            this.formGroup.patchValue({
                name: this.ticket.name,
                description: this.ticket.description,
                priority: this.ticket.priority.name,
                type: this.ticket.type.name,
                assignee: this.ticket.assignee
            });
        }
    }

    private readonly usersSearch$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    public onSearchChange(searchQuery: string | null): void {
        this.usersSearch$.next(searchQuery ?? "");
    }

    public extractValueFromEvent(event: Event): string | null {
        return (event.target as HTMLInputElement)?.value || null;
    }

    public onSubmitForm(): void {
        const formValue = this.formGroup.getRawValue();
        if (this.formGroup.valid && this.validate(formValue)) {
            this.submitForm.emit({
                ...formValue,
                project: this.projectName || this.ticket?.project.name!
            });
        }
    }

    public validate(formValue: ReturnType<typeof this.formGroup.getRawValue>): formValue is CreateTicketPayload {
        return formValue.assignee !== null;
    }

}
