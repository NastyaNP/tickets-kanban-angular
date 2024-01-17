import { Injectable } from "@angular/core";
import { AbstractTuiValueTransformer, TuiDay, TuiTime } from "@taiga-ui/cdk";


@Injectable()
export class IsoStringDateTimeValueTransformer extends AbstractTuiValueTransformer<
    [TuiDay | null, TuiTime | null],
    string
> {
    private readonly separator = `, `;

    public fromControlValue(controlValue: string): [TuiDay | null, TuiTime | null] {
        if (!controlValue) {
            return [null, null];
        }
        const [date, time]: string[] = controlValue.split("T");
        return [
            TuiDay.normalizeParse(date, "YMD"),
            TuiTime.fromString(
                time
                    .replace("Z", "")
                    .replace(".000", "")
            )
        ];
    }

    public toControlValue([day, time]: [TuiDay | null, TuiTime | null]): string {
        const dayMs: number = day?.toUtcNativeDate().getTime() ?? 0;
        const timeMs: number = time?.toAbsoluteMilliseconds() ?? 0;
        return new Date(dayMs + timeMs).toISOString();
    }
}
