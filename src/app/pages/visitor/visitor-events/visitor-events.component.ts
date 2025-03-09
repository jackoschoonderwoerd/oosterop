import { Component, inject, OnInit } from '@angular/core';
import { Band } from '../../../shared/models/band.model';
import { FirestoreService } from '../../../services/firestore.service';
import { Concert } from '../../../shared/models/concert.model';
import { GroupedConcerts } from '../../../shared/models/grouped-concerts.model';
import { MatTabsModule } from '@angular/material/tabs';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { take } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { UiStore } from '../../../services/ui.store';
import { AuthStore } from '../../../auth/auth.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-visitor-events',
    imports: [
        MatTabsModule,
        DatePipe, MatButtonToggleModule,
        MatExpansionModule,
        MatButtonModule,
        NgClass,
        MatIconModule
    ],
    templateUrl: './visitor-events.component.html',
    styleUrl: './visitor-events.component.scss'
})
export class VisitorEventsComponent implements OnInit {
    futureCollectedGroupedConcerts: GroupedConcerts[] = [];
    pastCollectedGroupedConcerts: GroupedConcerts[] = []
    fs = inject(FirestoreService);
    // seePastEvents: boolean = false;
    seeFutureEvents: boolean = true;
    uiStore = inject(UiStore);
    authStore = inject(AuthStore)
    upcomingConcerts: Concert[] = []


    ngOnInit(): void {
        this.getBands()
            .then((bands: Band[]) => {
                this.getConcertGroupedByBandname(bands)
                this.getAndSortConcerts(bands)
            })
    }

    getBands(): Promise<unknown> {
        const promise = new Promise((resolve, reject) => {
            this.fs.collection('bands')
                .pipe(take(1))
                .subscribe((bands: Band[]) => {
                    resolve(bands)
                })
        })
        return promise
    }

    getAndSortConcerts(bands: Band[]) {
        let upcomingConcerts: Concert[] = [];
        const pastConcerts: Concert[] = []
        bands.forEach((band: Band) => {
            if (band.concerts) {
                band.concerts.forEach((concert: Concert) => {
                    concert.bandName = band.name;
                    if (concert.date.seconds * 1000 > new Date().getTime()) {
                        upcomingConcerts.push(concert)
                    } else {
                        pastConcerts.push(concert)
                    }
                })
            }
        })
        this.upcomingConcerts = upcomingConcerts.sort((a: Concert, b: Concert) =>
            a.date.seconds - b.date.seconds
        )
        // console.log('upcoming: ', upcomingConcerts)
        // console.log('past: ', pastConcerts)
    }


    getConcertGroupedByBandname(bands: Band[]) {
        bands.forEach((band: Band) => {
            if (band.concerts && band.concerts.length > 0) {
                const futureGroupedConcerts: GroupedConcerts = {
                    bandName: band.name,
                    // concerts: band.concerts
                    concerts: []
                }
                const pastGroupedConcerts: GroupedConcerts = {
                    bandName: band.name,
                    // concerts: band.concerts
                    concerts: []
                }

                band.concerts.forEach((concert: Concert) => {
                    if (concert.date.seconds > new Date().getTime() / 1000) {
                        futureGroupedConcerts.concerts.push(concert)
                        // this.futureCollectedGroupedConcerts.push(futureGroupedConcerts)
                    } else {
                        pastGroupedConcerts.concerts.push(concert)
                        this.pastCollectedGroupedConcerts.push(pastGroupedConcerts)
                    }
                })
                futureGroupedConcerts.concerts.sort((a: Concert, b: Concert) => b.date.seconds - a.date.seconds)
                pastGroupedConcerts.concerts.sort((a: Concert, b: Concert) => b.date.seconds - a.date.seconds)
                // console.log('futureGroupedConcerts', futureGroupedConcerts);
                // console.log('pastGroupedConcerts', pastGroupedConcerts)

                if (futureGroupedConcerts.concerts.length > 0) {
                    this.futureCollectedGroupedConcerts.push(futureGroupedConcerts)
                }
                if (pastGroupedConcerts.concerts.length > 0) {
                    this.pastCollectedGroupedConcerts.push(pastGroupedConcerts)
                }

            }
        })
        this.futureCollectedGroupedConcerts = [...new Set(this.futureCollectedGroupedConcerts)]
        this.pastCollectedGroupedConcerts = [...new Set(this.pastCollectedGroupedConcerts)]
        // console.log(this.futureCollectedGroupedConcerts)

    }



    onPeriodSeleceted(period: string) {
        if (period === 'upcoming') {

            this.seeFutureEvents = true;
        } else if (period === 'past') {

            this.seeFutureEvents = false
        }
    }
}
