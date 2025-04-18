import { Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { TourPeriod } from '../../../shared/models/tour-period-model';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { Band } from '../../../shared/models/band.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthStore } from '../../../auth/auth.store';
import { UiStore } from '../../../services/ui.store';

@Component({
    selector: 'app-visitor-tour-periods',
    imports: [
        DatePipe,
        MatIconModule,
        MatButtonModule,

    ],
    templateUrl: './visitor-tour-periods.component.html',
    styleUrl: './visitor-tour-periods.component.scss'
})
export class VisitorTourPeriodsComponent implements OnInit {
    fs = inject(FirestoreService)
    tourPeriods: TourPeriod[] = [];
    router = inject(Router)
    authStore = inject(AuthStore);
    uiStore = inject(UiStore)

    ngOnInit(): void {
        this.getTourPeriods()
    }

    getTourPeriods() {
        this.fs.collection(`bands`)
            .pipe(take(1))
            .subscribe((bands: Band[]) => {
                bands.forEach((band: Band) => {
                    this.fs.getFieldInDocument(`bands/${band.id}`, 'tourPeriods')
                        .then((tourPeriods: TourPeriod[]) => {

                            if (tourPeriods) {
                                tourPeriods.forEach((tourPeriod: TourPeriod) => {
                                    if (tourPeriod.endDate.seconds > new Date().getTime() / 1000) {
                                        this.tourPeriods.push(tourPeriod)
                                    }
                                })
                            }
                            this.tourPeriods.sort((a, b) => {
                                return a.startDate.seconds - b.startDate.seconds
                            })
                        })
                })
            })
    }
    onInfo(bandId: string) {
        // console.log(bandId)
        this.router.navigate(['visitor-band', { bandId }])
    }
}
