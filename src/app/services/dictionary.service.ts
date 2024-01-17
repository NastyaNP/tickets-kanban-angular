import { inject, Injectable } from "@angular/core";
import { BACKEND_URL } from "../tokens/backend-url.token";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DictionaryItem } from "../models/dictionaries/dictionary-item.model";
import { TicketTypes } from "../models/tickets/ticket-types.enum";
import { TicketPriorities } from "../models/tickets/ticket-priorities.enum";
import { TicketStatuses } from "../models/tickets/ticket-statuses.enum";


@Injectable({ providedIn: "root" })
export class DictionaryService {

    private readonly backendUrl: string = inject(BACKEND_URL);
    private readonly httpClient: HttpClient = inject(HttpClient);

    public getTicketTypes(): Observable<DictionaryItem<TicketTypes>[]> {
        return this.httpClient.get<DictionaryItem<TicketTypes>[]>(`${this.backendUrl}/tickets/types`);
    }

    public getTicketPriorities(): Observable<DictionaryItem<TicketPriorities>[]> {
        return this.httpClient.get<DictionaryItem<TicketPriorities>[]>(`${this.backendUrl}/tickets/priorities`);
    }

    public getTicketStatuses(): Observable<DictionaryItem<TicketStatuses>[]> {
        return this.httpClient.get<DictionaryItem<TicketStatuses>[]>(`${this.backendUrl}/tickets/statuses`);
    }

}
