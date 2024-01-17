import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { TuiButtonModule, TuiDialogModule, TuiTextfieldControllerModule } from "@taiga-ui/core";
import { PopupTriggerComponent } from "../../../abstract/popup-trigger.abstract-component";
import { User } from "../../../models/users/user.model";
import { TuiIconModule } from "@taiga-ui/experimental";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AsyncPipe } from "@angular/common";
import { TuiDataListWrapperModule, TuiMultiSelectModule } from "@taiga-ui/kit";
import { BehaviorSubject, map, Observable, switchMap } from "rxjs";
import { TUI_DEFAULT_MATCHER, TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler } from "@taiga-ui/cdk";
import { processSearchValue } from "../../../utils/rxjs/operators/process-search-value.operator";
import { UsersService } from "../../../services/users.service";

@Component({
    selector: "app-invite-button",
    standalone: true,
    imports: [
        TuiButtonModule,
        TuiIconModule,
        TuiDialogModule,
        FormsModule,
        AsyncPipe,
        ReactiveFormsModule,
        TuiDataListWrapperModule,
        TuiMultiSelectModule,
    ],
    templateUrl: "./invite-button.component.html",
    styleUrl: "./invite-button.component.less"
})
export class InviteButtonComponent extends PopupTriggerComponent<User[]> {
    private readonly usersService: UsersService = inject(UsersService);

    @Input({ required: true }) set users(users: User[]) {
        this.usersControl.setValue(users);
        this.projectUsers = users;
    }

    @Output() inviteUsers: EventEmitter<User[]> = new EventEmitter<User[]>();

    public readonly usersControl = new FormControl<User[]>([], { nonNullable: true });
    public readonly users$: Observable<User[]>;
    public projectUsers: User[] = [];

    public readonly stringify: TuiStringHandler<User | TuiContextWithImplicit<User>> = item => {
        return "username" in item ? item.username : item.$implicit?.username ?? ""
    };
    public readonly usersIdentityMatcher: TuiIdentityMatcher<User> = (user1, user2) =>  user1.id === user2.id;

    private readonly usersSearch$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    constructor() {
        super();
        this.users$ = this.usersSearch$.pipe(
            processSearchValue({
                debounceTime: 500,
                distinctUntilChanged: true,
            }),
            switchMap((search: string) => this.usersService.getUsers(search).pipe(
                map((users: User[]) => {
                    const usersIds = new Set(this.projectUsers.map((user: User) => user.id));
                    return users.filter((user: User) => !usersIds.has(user.id));
                }),
                map((users: User[]) => users.filter((user: User) => TUI_DEFAULT_MATCHER(user, search, this.stringify))),
            )),
        );
    }

    public onSearchChange(searchQuery: string | null): void {
        this.usersSearch$.next(searchQuery ?? "");
    }

    public override onSubmit(formPayload: User[]): void {
        this.inviteUsers.emit(formPayload);
    }
}
