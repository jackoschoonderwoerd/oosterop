import { Component, inject, Input, OnInit } from '@angular/core';
import { IconSubmenuComponent } from '../../../../shared/icon-submenu/icon-submenu.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { Concert } from '../../../../shared/models/concert.model';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { Band } from '../../../../shared/models/band.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { take } from 'rxjs';

@Component({
    selector: 'app-visitor-band-concerts',
    imports: [
        IconSubmenuComponent,
        DatePipe,
        MatIconModule,
        MatButtonModule,
        DatePipe,
        MatExpansionModule,
        MatButtonToggleModule
    ],
    templateUrl: './visitor-band-concerts.component.html',
    styleUrl: './visitor-band-concerts.component.scss'
})
export class VisitorBandConcertsComponent implements OnInit {
    @Input() public band: Band;
    route = inject(ActivatedRoute)
    fs = inject(FirestoreService)
    panelExpanded: boolean = false;
    concerts: Concert[] = [];
    currentPeriodShown: string;
    showAllConcerts: boolean = true;
    router = inject(Router)




    ngOnInit(): void {
        if (!this.band) {
            console.log('no band')
            const bandId = this.route.snapshot.paramMap.get('bandId')
            this.getConcerts(bandId).then((concerts: Concert[]) => {
                this.splitConcertsPastNew(concerts)
            })
        } else {
            console.log('band')
            this.splitConcertsPastNew(this.band.concerts)
        }
        // const bandId = this.route.snapshot.paramMap.get('bandId')
        // this.getConcerts(bandId)
    }

    getConcerts(bandId) {
        const promise = new Promise((resolve, reject) => {
            const path = `bands/${bandId}`
            this.fs.getFieldInDocument(path, 'concerts')
                .then((concerts: Concert[]) => {
                    resolve(concerts)
                })
        })
        return promise
    }

    onPeriodSelected(event: Event, period: string) {
        event.stopPropagation();
        this.currentPeriodShown = period
        console.log(period);
        if (period === 'new') {
            this.concerts = this.getNewConcerts()
            this.showAllConcerts = false;

        } else if (period === 'past') {

            this.showAllConcerts = false;
            this.concerts = this.getPastConcerts()
        } else if (period === 'all') {
            this.showAllConcerts = true;

            this.concerts = this.getAllConcerts();
        }
    }

    onPanelClicked(panel: MatExpansionPanel) {
        this.panelExpanded = panel.expanded;
        setTimeout(() => {
            this.concerts = this.getAllConcerts();
            this.showAllConcerts = true;

        }, 500);
    }

    getAllConcerts() {
        return this.band.concerts;
    };

    getPastConcerts() {
        let newConcerts: Concert[] = []
        this.band.concerts.forEach((concert: Concert) => {
            if (new Date(concert.date.seconds * 1000) < new Date) {
                newConcerts.push(concert)
            }
        })
        return newConcerts

    }
    getNewConcerts() {
        let newConcerts: Concert[] = []
        this.band.concerts.forEach((concert: Concert) => {
            if (new Date(concert.date.seconds * 1000) >= new Date) {
                newConcerts.push(concert)
            }
        })
        return newConcerts
    }



    splitConcertsPastNew(concerts: Concert[]) {
        concerts.forEach((concert: Concert) => {
            if (new Date(concert.date.seconds * 1000) > new Date) {
                this.concerts.push(concert)
            } else {
                this.concerts.push(concert)
            }
        })
        console.log(this.concerts)
    }
    onUrl(url: string) {
        console.log(url);
        this.router.navigate(['visitor-iframe', { url }])
    }
}
