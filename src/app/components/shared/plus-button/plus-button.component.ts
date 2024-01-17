import { Component, EventEmitter, Output } from "@angular/core";
import { TuiButtonModule } from "@taiga-ui/core";
import { TuiIconModule } from "@taiga-ui/experimental";

@Component({
    selector: "app-plus-button",
    standalone: true,
    imports: [
        TuiButtonModule,
        TuiIconModule
    ],
    templateUrl: "./plus-button.component.html",
    styleUrl: "./plus-button.component.less"
})
export class PlusButtonComponent {
    @Output() onClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
}
