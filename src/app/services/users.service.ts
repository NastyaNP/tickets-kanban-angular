import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BACKEND_URL } from "../tokens/backend-url.token";
import { Observable } from "rxjs";
import { User } from "../models/users/user.model";


@Injectable({ providedIn: "root" })
export class UsersService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly apiUrl: string = inject(BACKEND_URL);

    public getUsers(searchValue: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users?search=${searchValue}`);
    }

}
