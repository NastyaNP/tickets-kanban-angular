import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TuiButtonModule, TuiDialogModule } from "@taiga-ui/core";
import { PlusButtonComponent } from "../../shared/plus-button/plus-button.component";
import { PopupTriggerComponent } from "../../../abstract/popup-trigger.abstract-component";
import { ProjectFormComponent } from "../project-form/project-form.component";
import { CreateProjectPayload } from "../../../models/payloads/project/create-project.payload";

@Component({
    selector: "app-create-project-button",
    standalone: true,
    imports: [
        TuiButtonModule,
        PlusButtonComponent,
        TuiDialogModule,
        ProjectFormComponent
    ],
    templateUrl: "./create-project-button.component.html",
    styleUrl: "./create-project-button.component.less"
})
export class CreateProjectButtonComponent extends PopupTriggerComponent<CreateProjectPayload> {
    @Input({ required: true }) formLoading!: boolean | null;

    @Output() createProject: EventEmitter<CreateProjectPayload> = new EventEmitter<CreateProjectPayload>();

    public onSubmit(formPayload: CreateProjectPayload) {
        this.createProject.emit(formPayload);
    }
}
