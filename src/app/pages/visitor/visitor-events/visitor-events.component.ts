import { Component, inject, OnInit } from '@angular/core';
import { Band } from '../../../shared/models/band.model';
import { FirestoreService } from '../../../services/firestore.service';
import { Concert } from '../../../shared/models/concert.model';
import { GroupedConcerts } from '../../../shared/models/grouped-concerts.model';
import { MatTabsModule } from '@angular/material/tabs';
import { DatePipe, JsonPipe } from '@angular/common';
import { take } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-visitor-events',
    imports: [MatTabsModule, DatePipe, MatButtonToggleModule, MatExpansionModule],
    templateUrl: './visitor-events.component.html',
    styleUrl: './visitor-events.component.scss'
})
export class VisitorEventsComponent implements OnInit {
    futureCollectedGroupedConcerts: GroupedConcerts[] = [];
    pastCollectedGroupedConcerts: GroupedConcerts[] = []
    fs = inject(FirestoreService);
    // seePastEvents: boolean = false;
    seeFutureEvents: boolean = true;

    ngOnInit(): void {
        this.getBands()
            .then((bands: Band[]) => {
                this.getConcertGroupedByBandname(bands)
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

    getConcertGroupedByBandname(bands: Band[]) {
        bands.forEach((band: Band) => {
            if (band.concerts && band.concerts.length > 0) {
                const futureGroupedConcerts: GroupedConcerts = {
                    bandName: band.name,
                    concerts: band.concerts
                }
                const pastGroupedConcerts: GroupedConcerts = {
                    bandName: band.name,
                    concerts: band.concerts
                }
                band.concerts.forEach((concert: Concert) => {
                    console.log(concert.date.seconds > new Date().getTime() / 1000)
                    if (concert.date.seconds > new Date().getTime() / 1000) {
                        this.futureCollectedGroupedConcerts.push(futureGroupedConcerts)
                    } else {
                        this.pastCollectedGroupedConcerts.push(pastGroupedConcerts)
                    }
                })
                futureGroupedConcerts.concerts.sort((a: Concert, b: Concert) => b.date.seconds - a.date.seconds)
                pastGroupedConcerts.concerts.sort((a: Concert, b: Concert) => b.date.seconds - a.date.seconds)
            }
        })
        this.futureCollectedGroupedConcerts = [...new Set(this.futureCollectedGroupedConcerts)]
        this.pastCollectedGroupedConcerts = [...new Set(this.pastCollectedGroupedConcerts)]
        console.log(this.futureCollectedGroupedConcerts)
        console.log(this.pastCollectedGroupedConcerts)
    }

    onButtonToggle(period: string) {
        if (period === 'upcoming') {
            this.seeFutureEvents = true;
        } else if (period === 'past') {
            this.seeFutureEvents = false
        }
    }
}
