import { Directive } from "@angular/core";


@Directive()
export abstract class PopupTriggerComponent<T extends object> {

    public isPopupVisible: boolean = false;

    public abstract onSubmit(formPayload: T): void;

    public hidePopup(): void {
        this.isPopupVisible = false;
    }

    public showPopup(): void {
        this.isPopupVisible = true;
    }


}
