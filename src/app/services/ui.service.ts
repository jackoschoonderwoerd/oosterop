import { EventEmitter, inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Band } from '../shared/models/band.model';
import { UiStore } from './ui.store';
import { Musician } from '../shared/models/musician.model';
import { Concert } from '../shared/models/concert.model';


@Injectable({
    providedIn: 'root'
})
export class UiService {
    fs = inject(FirestoreService);
    uiStore = inject(UiStore);

    bandChanged = new EventEmitter<void>();

    scrollToTopContent = new EventEmitter<void>()

    bandIdSelected = new EventEmitter<string>();
    articleIdSelected = new EventEmitter<string>()

    bandsVisible = new EventEmitter<boolean>();
    articlesVisible = new EventEmitter<boolean>();

    visitorBandComponentReady = new EventEmitter<void>()

    navigationHistoryChanged = new EventEmitter<string>();

    constructor() { }

    getBand(bandId: string) {
        this.fs.getDoc(`bands/${bandId}`)
            .subscribe((band: Band) => {
                console.log(band.bandMemberIds)
                this.uiStore.setBandname(band.name);
                this.uiStore.setOImages(band.oImages);
                this.getBandMembers(band.bandMemberIds).then((bandmembers: Musician[]) => {
                    this.uiStore.setBandMembers(bandmembers);
                });
                this.uiStore.setBandBody(band.body);
                this.uiStore.setOAudios(band.oAudios);
                this.uiStore.setBandLinks(band.links);
                this.getUpcomingConcerts(band.concerts)
                    .then((upcomingConcerts: Concert[]) => {
                        console.log(upcomingConcerts);
                        if (upcomingConcerts && upcomingConcerts.length > 0) {

                            this.uiStore.setUpcomingConcerts(upcomingConcerts);
                        } else {
                            this.uiStore.setUpcomingConcerts([])
                        }
                    });
                this.uiStore.setBandTourPeriods(band.tourPeriods);

                this.uiStore.setHomeSelected(false)

            });
    }

    getBandMembers(bandmemberIds: string[]) {
        const bandmembers: Musician[] = []
        const promise = new Promise((resolve, reject) => {
            bandmemberIds.forEach((id: string) => {
                this.fs.getDoc(`musicians/${id}`)
                    .subscribe((bandmember: Musician) => {
                        bandmembers.push(bandmember)
                    })
            })
            resolve(bandmembers)
        })
        return promise
    }

    getUpcomingConcerts(concerts) {
        const promise = new Promise((resolve, reject) => {
            let upcomingConcerts: Concert[] = []
            if (concerts) {
                concerts.forEach((concert: Concert) => {
                    if (concert.date.seconds * 1000 > new Date().getTime())
                        upcomingConcerts.push(concert)
                })
                resolve(upcomingConcerts)
            } else {
                resolve([])
            }
        })
        return promise
    }
}
