import { EventEmitter, inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Concert } from '../../../../shared/models/concert.model';
import { FirestoreService } from '../../../../services/firestore.service';

@Injectable({
    providedIn: 'root'
})
export class VisitorBandConcertsService {

    fs = inject(FirestoreService)

    private pastConcertsSubject = new BehaviorSubject<Concert[]>(null);
    pastConcerts$: any = this.pastConcertsSubject.asObservable();

    private upcomingConcertsSubject = new BehaviorSubject<Concert[]>(null);
    upcomingConcerts$: any = this.upcomingConcertsSubject.asObservable();

    upcomingConcerts = new EventEmitter<Concert[]>()


    constructor() { }


    getConcerts(bandId) {
        this.fs.getFieldInDocument(`bands/${bandId}`, 'concerts')
            .then((concerts: Concert[]) => {
                this.splitConcertsByPastUpcoming(concerts)
            })
    }

    splitConcertsByPastUpcoming(concerts: Concert[]) {
        const pastConcerts: Concert[] = [];
        const upcomingConcerts: Concert[] = []
        concerts.forEach((concert: Concert) => {
            // console.log(concert)
            if (concert.date.seconds * 1000 < new Date().getTime()) {
                pastConcerts.push(concert)
            } else {
                upcomingConcerts.push(concert)
            }
        })

        this.pastConcertsSubject.next(pastConcerts)
        this.upcomingConcertsSubject.next(upcomingConcerts)
        // // console.log('pastConcerts: ', pastConcerts)

    }


}
