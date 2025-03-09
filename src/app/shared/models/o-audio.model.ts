import { SafeUrl } from "@angular/platform-browser";

export interface OAudio {
    code: string | any;
    title?: string;
    comments?: string;
    visible: boolean;
    safeUrl: SafeUrl;
}
