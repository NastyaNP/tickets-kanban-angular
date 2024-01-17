import { Directive, EventEmitter, HostListener } from "@angular/core";


@Directive()
export class ContextMenuComponent {

    @HostListener("click", ["$event"])
    public onClick(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();
    }

    public isMenuOpen: boolean = false;

    public emitEvent<T>(event: EventEmitter<T>, value?: T): void {
        this.isMenuOpen = false;
        event.emit(value);
    }

}
