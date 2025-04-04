import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Band } from '../../../shared/models/band.model';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Concert } from '../../../shared/models/concert.model';
import { FirestoreService } from '../../../services/firestore.service';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Musician } from '../../../shared/models/musician.model';
import { NavigationService } from '../../../navigation/navigation.service';
import { take } from 'rxjs';
import { UiService } from '../../../services/ui.service';
import { UiStore } from '../../../services/ui.store';
import { VisitorBandAudioVideoComponent } from './visitor-band-audio-video/visitor-band-audio-video.component';
import { VisitorBandBandmembersComponent } from './visitor-band-bandmembers/visitor-band-bandmembers.component';
import { VisitorBandBodyComponent } from './visitor-band-body/visitor-band-body.component';
import { VisitorBandConcertsComponent } from './visitor-band-concerts/visitor-band-concerts.component';
import { VisitorBandConcertsService } from './visitor-band-concerts/visitor-band-concerts.service';
import { VisitorBandLinksComponent } from './visitor-band-links/visitor-band-links.component';
import { VisitorBandOImagesComponent } from './visitor-band-o-images/visitor-band-o-images.component';
import { VisitorBandTourPeriodsComponent } from './visitor-band-tour-periods/visitor-band-tour-periods.component';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-visitor-band',
    imports: [
        MatButtonModule,
        MatButtonToggleModule,
        MatExpansionModule,
        MatIconModule,
        MatTabsModule,
        MatToolbarModule,
        RouterModule,
        VisitorBandAudioVideoComponent,
        VisitorBandBandmembersComponent,
        VisitorBandBodyComponent,
        VisitorBandConcertsComponent,
        VisitorBandLinksComponent,
        VisitorBandOImagesComponent,
        VisitorBandTourPeriodsComponent,
    ],
    templateUrl: './visitor-band.component.html',
    styleUrl: './visitor-band.component.scss'
})
export class VisitorBandComponent implements OnInit {
    fs = inject(FirestoreService)
    navigationService = inject(NavigationService)
    route = inject(ActivatedRoute)
    router = inject(Router)
    sb = inject(SnackbarService)
    uiService = inject(UiService)
    uiStore = inject(UiStore);
    visitorBandConcertsService = inject(VisitorBandConcertsService)
    band: Band;
    bandMembers: Musician[] = [];
    concerts: Concert[] = [];
    panelExpanded: boolean = false;
    showVisitorBandConcertsComponent: boolean = false;
    subMenuItems: string[] = [];
    upcomingConcerts: Concert[] = []

    @ViewChild('top') public top: ElementRef


    ngOnInit(): void {
        this.uiService.bandIdSelected.subscribe((bandId: string) => {
            console.log(bandId);
            this.showVisitorBandConcertsComponent = false;
            this.getBand(bandId)
            this.getConcerts(bandId)
                .then((concerts: Concert[]) => {
                    return this.getUpcomingConcerts(concerts)
                })
                .then((upcomingConcerts: Concert[]) => {
                    this.upcomingConcerts = [];
                    this.upcomingConcerts = upcomingConcerts
                    if (this.upcomingConcerts.length > 0) {
                        this.showVisitorBandConcertsComponent = true
                    }
                    setTimeout(() => {
                        this.visitorBandConcertsService.upcomingConcerts.next(upcomingConcerts)
                    }, 1000);

                })
        })
    }



    getBand(bandId: string) {
        console.log('getBand()', bandId)
        const path = `bands/${bandId}`
        this.fs.getDoc(path).pipe(take(1)).subscribe((band: Band) => {
            if (band) {
                this.band = band;
                const bandMemberIds: string[] = band.bandMemberIds
                this.getBandMembers(bandMemberIds);
                this.uiStore.setBand(band)
            } else {
                this.fs.getFirstDocument(`bands`)
                    .subscribe((band: Band) => {
                        this.band = band;
                        this.uiStore.setBand(band)
                        this.sb.openSnackbar(`selected band not available`)
                    })
            }

        })
    }
    getBandMembers(bandMemberIds: string[]) {
        if (bandMemberIds) {
            bandMemberIds.forEach((memberId: string) => {
                this.bandMembers = [];
                const path = `musicians/${memberId}`
                this.fs.getDoc(path).pipe(take(1)).subscribe((bandMember: Musician) => {
                    if (bandMember) {
                        this.bandMembers.push(bandMember)
                    }
                })
            })
        }
    }

    getConcerts(bandId) {
        const promise = new Promise((resolve, reject) => {
            this.fs.getFieldInDocument(`bands/${bandId}`, 'concerts')
                .then((concerts: Concert) => {

                    resolve(concerts);
                })

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
            }
        })
        return promise
    }

    scrollToTop() {
        const targetElement = this.top.nativeElement
        targetElement.scrollIntoView({ behavior: 'smooth' })
    }
}
