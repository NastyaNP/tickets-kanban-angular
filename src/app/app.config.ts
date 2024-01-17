import { provideAnimations } from "@angular/platform-browser/animations";
import {
    TuiAlertModule,
    TuiAppearance, TuiButtonModule,
    tuiButtonOptionsProvider,
    TuiDialogModule,
    TuiRootModule, TuiTooltipModule
} from "@taiga-ui/core";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./interceptors/auth.interceptor";
import { TuiPushModule } from "@taiga-ui/kit";
import { TuiIconModule, tuiIconResolverProvider, TuiIconsModule } from "@taiga-ui/experimental";
import { provideValidationErrorMessages } from "./providers/tui-providers/validation-error-messages.provider";
import { provideDateTimeValueTransformer } from "./providers/tui-providers/date/date-time-value-transformer.provider";
import {
    IsoStringDateTimeValueTransformer
} from "./utils/tui-utils/transformers/iso-string-date-time-value.transformer";
import { BACKEND_URL } from "./tokens/backend-url.token";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(routes),
        importProvidersFrom(
            TuiRootModule,
            TuiDialogModule,
            TuiAlertModule,
            TuiPushModule,
            TuiIconModule,
            TuiTooltipModule,
            TuiIconsModule,
            TuiButtonModule,
        ),
        tuiIconResolverProvider((icon: string) => icon?.includes("/")
            ? icon
            : icon?.startsWith("tui")
                ? `/assets/taiga-ui/icons/${icon}Outline.svg`
                : `/assets/icons/${icon}.svg`
        ),
        provideValidationErrorMessages({
            required: "This Field is required!",
            email: "Email is invalid!",
            minlength: "Should be at least 6 characters long!",
            maxlength: "Should be no more than 16 characters long!",
        }),
        provideDateTimeValueTransformer(IsoStringDateTimeValueTransformer),
        {
            provide: BACKEND_URL,
            useValue: "https://tickets-kanban-be.onrender.com",
        },
        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
    ]
};
