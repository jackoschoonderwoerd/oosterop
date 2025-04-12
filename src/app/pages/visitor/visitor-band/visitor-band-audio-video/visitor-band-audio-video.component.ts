import { Component, inject, Input } from '@angular/core';

import { OAudio } from '../../../../shared/models/o-audio.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IframeComponent } from './iframe/iframe.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { VisibilityEyesComponent } from '../../../../shared/visibility-eyes/visibility-eyes.component';
import { UiStore } from '../../../../services/ui.store';
import { JsonPipe } from '@angular/common';
import { AuthStore } from '../../../../auth/auth.store';

@Component({
    selector: 'app-visitor-band-audio-video',
    imports: [
        IframeComponent,
        MatExpansionModule,
        VisibilityEyesComponent,
        JsonPipe
    ],
    templateUrl: './visitor-band-audio-video.component.html',
    styleUrl: './visitor-band-audio-video.component.scss'
})
export class VisitorBandAudioVideoComponent {


    hrefs: string[] = [];
    sanitizer = inject(DomSanitizer);
    isLoading: boolean = true
    uiStore = inject(UiStore);
    visibleOAudios: number;
    authStore = inject(AuthStore)

    ngOnInit(): void {

        this.countVisibleOAudios();

    }

    countVisibleOAudios() {
        let counter: number = 0;
        this.uiStore.bandOAudios().forEach((oAudio: OAudio) => {
            if (oAudio.visible) {
                this.visibleOAudios++
            }
        })

    }

}
