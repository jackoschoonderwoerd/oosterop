import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { IconSubmenuComponent } from '../../../../shared/icon-submenu/icon-submenu.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { Concert } from '../../../../shared/models/concert.model';
import { DatePipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { Band } from '../../../../shared/models/band.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { take } from 'rxjs';
import { VisibilityEyesComponent } from '../../../../shared/visibility-eyes/visibility-eyes.component';
import { AuthStore } from '../../../../auth/auth.store';
import { UiStore } from '../../../../services/ui.store';
import { VisitorBandConcertsPastComponent } from './visitor-band-concerts-past/visitor-band-concerts-past.component';
import { VisitorBandConcertsUpcomingComponent } from './visitor-band-concerts-upcoming/visitor-band-concerts-upcoming.component';
import { MatTabsModule } from '@angular/material/tabs';
import { VisitorBandConcertsService } from './visitor-band-concerts.service';


@Component({
    selector: 'app-visitor-band-concerts',
    imports: [
        IconSubmenuComponent,
        DatePipe,
        MatIconModule,
        MatButtonModule,
        DatePipe,
        MatExpansionModule,
        MatButtonToggleModule,
        NgClass,
        VisibilityEyesComponent,
        VisitorBandConcertsPastComponent,
        VisitorBandConcertsUpcomingComponent,
        MatTabsModule
    ],
    templateUrl: './visitor-band-concerts.component.html',
    styleUrl: './visitor-band-concerts.component.scss',

    encapsulation: ViewEncapsulation.None,
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
    showPast: boolean = false;
    showAll: boolean = true;
    showUpcoming: boolean = false;
    authStore = inject(AuthStore);
    uiStore = inject(UiStore)
    upcomingConcerts: Concert[] = []
    pastConcerts: Concert[] = []
    visitorBandConcertsService = inject(VisitorBandConcertsService)




    ngOnInit(): void {
        const bandId = this.route.snapshot.paramMap.get('bandId')
        this.visitorBandConcertsService.getConcerts(bandId)

        // this.getConcerts(bandId)
        // this.splitConcertsPastNew(this.band.concerts)

    }

    getConcerts(bandId) {
        console.log(bandId)
        // const promise = new Promise((resolve, reject) => {
        const path = `bands/${bandId}`
        this.fs.getFieldInDocument(path, 'concerts')
            .then((concerts: Concert[]) => {
                // resolve(concerts)
                console.log(concerts)
                this.splitConcertsPastNew(concerts)
            })
        // })
        // return promise
    }

    splitConcertsPastNew(concerts: Concert[]) {
        console.log(concerts)
        concerts.forEach((concert: Concert) => {
            if (new Date(concert.date.seconds * 1000) > new Date) {
                this.upcomingConcerts.push(concert)
            } else {
                this.pastConcerts.push(concert)
            }
        })
        console.log('this.upcomingConcerts: ', this.upcomingConcerts)
        console.log('this.pastConcerts: ', this.pastConcerts)
    }




}
