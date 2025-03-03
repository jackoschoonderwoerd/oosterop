import { Component, Input } from '@angular/core';
import { TourPeriod } from '../../../../shared/models/tour-period-model';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-visitor-band-tour-periods',
    imports: [MatExpansionModule, DatePipe],
    templateUrl: './visitor-band-tour-periods.component.html',
    styleUrl: './visitor-band-tour-periods.component.scss'
})
export class VisitorBandTourPeriodsComponent {
    @Input() public tourPeriods: TourPeriod[]

    constructor() {
        console.log(this.tourPeriods)
    }
}
