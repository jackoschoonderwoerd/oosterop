import { Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { TourPeriod } from '../../../shared/models/tour-period-model';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { Band } from '../../../shared/models/band.model';

@Component({
    selector: 'app-visitor-tour-periods',
    imports: [DatePipe],
    templateUrl: './visitor-tour-periods.component.html',
    styleUrl: './visitor-tour-periods.component.scss'
})
export class VisitorTourPeriodsComponent implements OnInit {
    fs = inject(FirestoreService)
    tourPeriods: TourPeriod[]

    ngOnInit(): void {
        this.getTourPeriods()
    }



    getTourPeriods() {
        this.fs.collection(`bands`)
            // .pipe(take(1))
            .subscribe((bands: Band[]) => {
                bands.forEach((band: Band) => {
                    this.fs.getFieldInDocument(`bands/${band.id}`, 'tourPeriods')
                        .then((tourPeriods: TourPeriod[]) => {
                            this.tourPeriods = tourPeriods
                        })
                })
            })
        //     this.fs.sortedCollection('tour-periods', 'startDate', 'desc')
        //         .subscribe((tourPeriods: TourPeriod[]) => {
        //             this.tourPeriods = tourPeriods
        //         })
    }
}
