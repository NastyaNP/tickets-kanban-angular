import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from "./pages/login/login.component";
import { noAuthorizedGuard } from "./guards/no-authorized.guard";
import { authorizedGuard } from "./guards/authorized.guard";
import { TicketDetailsPageComponent } from "./pages/ticket-details-page/ticket-details-page.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { projectResolver } from "./resolvers/project.resolver";

export const routes: Routes = [
    {
        path: "registration",
        pathMatch: "full",
        component: RegistrationComponent,
        canActivate: [noAuthorizedGuard],
    },
    {
        path: "login",
        pathMatch: "full",
        component: LoginComponent,
        canActivate: [noAuthorizedGuard],
    },
    {
        path: "project",
        pathMatch: "full",
        component: MainPageComponent,
    },
    {
        path: "project/:id",
        pathMatch: "full",
        component: MainPageComponent,
        resolve: {
            project: projectResolver,
        }
    },
    {
        path: "ticket/:id",
        pathMatch: "full",
        component: TicketDetailsPageComponent,
        canActivate: [authorizedGuard],
    },
    {
        path: "**",
        redirectTo: "/project",
    }
];
