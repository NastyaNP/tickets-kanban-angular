import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { User } from "../../../models/users/user.model";
import {
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiInputModule,
    TuiMultiSelectModule,
    TuiTextareaModule
} from "@taiga-ui/kit";
import { TuiButtonModule, TuiTextfieldControllerModule } from "@taiga-ui/core";
import { CreateProjectPayload } from "../../../models/payloads/project/create-project.payload";
import { Project } from "../../../models/projects/project.model";
import { TUI_DEFAULT_MATCHER, TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler } from "@taiga-ui/cdk";
import { BehaviorSubject, map, Observable, switchMap } from "rxjs";
import { UsersService } from "../../../services/users.service";
import { CommonModule } from "@angular/common";
import { processSearchValue } from "../../../utils/rxjs/operators/process-search-value.operator";

@Component({
    selector: "app-project-form",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TuiInputModule,
        TuiTextareaModule,
        TuiButtonModule,
        TuiMultiSelectModule,
        TuiDataListWrapperModule,
        TuiTextfieldControllerModule,
        TuiComboBoxModule
    ],
    templateUrl: "./project-form.component.html",
    styleUrl: "./project-form.component.less"
})
export class ProjectFormComponent implements OnInit {
    private readonly usersService: UsersService = inject(UsersService);

    @Input() loading: boolean | null = false;
    @Input() project: Project | null = null;

    @Output() submitForm: EventEmitter<CreateProjectPayload> = new EventEmitter<CreateProjectPayload>();
    @Output() cancelled: EventEmitter<void> = new EventEmitter<void>();

    public readonly formGroup = new FormGroup({
        name: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required]
        }),
        description: new FormControl<string>("", {
            nonNullable: true,
            validators: [],
        }),
        users: new FormControl<User[]>([], { nonNullable: true })
    });

    public readonly users$: Observable<User[]>;
    public readonly stringify: TuiStringHandler<User | TuiContextWithImplicit<User>> = item => {
        return "username" in item ? item.username : item.$implicit?.username ?? ""
    };
    public readonly usersIdentityMatcher: TuiIdentityMatcher<User> = (user1, user2) =>  user1.id === user2.id;

    private readonly usersSearch$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    constructor() {
        this.users$ = this.usersSearch$.pipe(
            processSearchValue({
                debounceTime: 500,
                distinctUntilChanged: true,
            }),
            switchMap((search: string) => this.usersService.getUsers(search).pipe(
                map((users: User[]) => users.filter((user: User) => TUI_DEFAULT_MATCHER(user, search, this.stringify))),
            )),
        );
    }

    public ngOnInit(): void {
        if (this.project) {
            this.formGroup.patchValue({
                name: this.project.name,
                description: this.project.description,
                users: this.project.users ?? []
            });
        }
    }

    public onSearchChange(searchQuery: string | null): void {
        this.usersSearch$.next(searchQuery ?? "");
    }

    public onSubmitForm(): void {
        if (this.formGroup.valid) {
            this.submitForm.emit(this.formGroup.getRawValue());
        }
    }

}
