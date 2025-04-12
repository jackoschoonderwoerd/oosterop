import { Component, inject, Input } from '@angular/core';
import { TourPeriod } from '../../../../shared/models/tour-period-model';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { VisibilityEyesComponent } from '../../../../shared/visibility-eyes/visibility-eyes.component';
import { UiStore } from '../../../../services/ui.store';
import { AuthStore } from '../../../../auth/auth.store';

@Component({
    selector: 'app-visitor-band-tour-periods',
    imports: [MatExpansionModule, DatePipe, MatIconModule, VisibilityEyesComponent],
    templateUrl: './visitor-band-tour-periods.component.html',
    styleUrl: './visitor-band-tour-periods.component.scss'
})
export class VisitorBandTourPeriodsComponent {
    uiStore = inject(UiStore);
    authStore = inject(AuthStore)

    @Input() public tourPeriods: TourPeriod[]

    constructor() {
        // console.log(this.tourPeriods)
    }
}
