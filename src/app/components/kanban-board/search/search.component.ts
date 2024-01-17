import { Component, DestroyRef, EventEmitter, inject, Output } from "@angular/core";
import { TuiInputModule } from "@taiga-ui/kit";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TuiTextfieldControllerModule } from "@taiga-ui/core";

@Component({
    selector: "app-search",
    standalone: true,
    imports: [
        TuiInputModule,
        ReactiveFormsModule,
        TuiTextfieldControllerModule
    ],
    templateUrl: "./search.component.html",
    styleUrl: "./search.component.less"
})
export class SearchComponent {
    private readonly destroyRef = inject(DestroyRef);

    @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

    public searchControl = new FormControl<string>("", { nonNullable: true });

    constructor() {
        this.searchControl.valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((value: string) => this.searchChange.emit(value));
    }
}
