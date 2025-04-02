import { Component, inject, Input, OnInit } from '@angular/core';
import { Concert } from '../../../../../shared/models/concert.model';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { AuthStore } from '../../../../../auth/auth.store';
import { UiStore } from '../../../../../services/ui.store';
import { VisibilityEyesComponent } from '../../../../../shared/visibility-eyes/visibility-eyes.component';
import { VisitorBandConcertsService } from '../visitor-band-concerts.service';

@Component({
    selector: 'app-visitor-band-concerts-past',
    imports: [
        JsonPipe,
        DatePipe,
        AsyncPipe,
        VisibilityEyesComponent
    ],
    templateUrl: './visitor-band-concerts-past.component.html',
    styleUrl: './visitor-band-concerts-past.component.scss'
})
export class VisitorBandConcertsPastComponent {

    @Input() public pastConcerts: Concert[];
    authStore = inject(AuthStore);
    uiStore = inject(UiStore);
    VBCService = inject(VisitorBandConcertsService)




    onUrl(url: string) {

    }
}
