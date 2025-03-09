import { Component, inject, Input } from '@angular/core';
import { Concert } from '../../../../../shared/models/concert.model';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { VisibilityEyesComponent } from '../../../../../shared/visibility-eyes/visibility-eyes.component';
import { AuthStore } from '../../../../../auth/auth.store';
import { UiStore } from '../../../../../services/ui.store';
import { VisitorBandConcertsService } from '../visitor-band-concerts.service';

@Component({
    selector: 'app-visitor-band-concerts-upcoming',
    imports: [
        AsyncPipe,
        JsonPipe,
        DatePipe,
        VisibilityEyesComponent
    ],
    templateUrl: './visitor-band-concerts-upcoming.component.html',
    styleUrl: './visitor-band-concerts-upcoming.component.scss'
})
export class VisitorBandConcertsUpcomingComponent {

    authStore = inject(AuthStore);
    uiStore = inject(UiStore);
    VBCService = inject(VisitorBandConcertsService)



}
