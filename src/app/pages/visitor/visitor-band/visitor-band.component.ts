import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { Band } from '../../../shared/models/band.model';
import { take } from 'rxjs';
import { Musician } from '../../../shared/models/musician.model';
import { MusicianComponent } from '../../../shared/musician/musician.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NavigationService } from '../../../navigation/navigation.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IconSubmenuComponent } from '../../../shared/icon-submenu/icon-submenu.component';
import { UiStore } from '../../../services/ui.store';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Concert } from '../../../shared/models/concert.model';
import { VisitorBandConcertsComponent } from './visitor-band-concerts/visitor-band-concerts.component';
import { VisitorBandReviewsComponent } from './visitor-band-reviews/visitor-band-reviews.component';
import { VisitorBandAudioVideoComponent } from './visitor-band-audio-video/visitor-band-audio-video.component';
import { VisitorBandLinksComponent } from './visitor-band-links/visitor-band-links.component';
import { VisitorBandQuotesComponent } from './visitor-band-quotes/visitor-band-quotes.component';
import { VisitorBandRecordingsComponent } from './visitor-band-recordings/visitor-band-recordings.component';
import { VisitorBandBandmembersComponent } from './visitor-band-bandmembers/visitor-band-bandmembers.component';
import { VisitorBandTourPeriodsComponent } from './visitor-band-tour-periods/visitor-band-tour-periods.component';
import { VisitorBandOImagesComponent } from './visitor-band-o-images/visitor-band-o-images.component';
import { VisitorBandBodyComponent } from './visitor-band-body/visitor-band-body.component';
import { LogoComponent } from '../logo/logo.component';
import { VisitorTourPeriodsComponent } from '../visitor-tour-periods/visitor-tour-periods.component';
import { VisitorBandsOverviewComponent } from '../visitor-bands-overview/visitor-bands-overview.component';
import { VisitorEventsComponent } from '../visitor-events/visitor-events.component';
import { UiService } from '../../../services/ui.service';
import { VisitorBandConcertsService } from './visitor-band-concerts/visitor-band-concerts.service';

@Component({
    selector: 'app-visitor-band',
    imports: [
        MusicianComponent,
        MatTabsModule,
        MatToolbarModule,
        JsonPipe,
        MatIconModule,
        MatButtonModule,
        IconSubmenuComponent,
        MatExpansionModule,
        DatePipe,
        MatButtonToggleModule,
        VisitorBandConcertsComponent,
        VisitorBandReviewsComponent,
        VisitorBandAudioVideoComponent,
        VisitorBandLinksComponent,
        VisitorBandQuotesComponent,
        VisitorBandRecordingsComponent,
        VisitorBandBandmembersComponent,
        VisitorBandTourPeriodsComponent,
        VisitorBandOImagesComponent,
        VisitorBandBodyComponent,
        VisitorTourPeriodsComponent,
        VisitorBandsOverviewComponent,
        VisitorEventsComponent,
        LogoComponent,
        RouterModule
    ],
    templateUrl: './visitor-band.component.html',
    styleUrl: './visitor-band.component.scss'
})
export class VisitorBandComponent implements OnInit {
    route = inject(ActivatedRoute)
    fs = inject(FirestoreService)
    navigationService = inject(NavigationService)
    uiStore = inject(UiStore);
    uiService = inject(UiService)
    band: Band;
    bandMembers: Musician[] = [];
    subMenuItems: string[] = [];
    panelExpanded: boolean = false;
    concerts: Concert[] = [];
    router = inject(Router)
    upcomingConcerts: Concert[] = []
    visitorBandConcertsService = inject(VisitorBandConcertsService)
    showVisitorBandConcertsComponent: boolean = false;

    @ViewChild('top') public top: ElementRef


    ngOnInit(): void {
        this.route.paramMap.subscribe((params: any) => {
            const bandId = params.get('bandId')
            this.bandMembers = [];
            this.getBand(bandId)
            this.getConcerts(bandId)
        })
        this.uiService.bandIdSelected.subscribe((bandId: string) => {
            this.showVisitorBandConcertsComponent = false;
            // this.upcomingConcerts = [];
            console.log(bandId)
            this.getBand(bandId)
            this.getConcerts(bandId)
                .then((concerts: Concert[]) => {
                    return this.getUpcomingConcerts(concerts)
                })
                .then((upcomingConcerts: Concert[]) => {
                    this.upcomingConcerts = [];
                    console.log(this.upcomingConcerts.length)
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
        const path = `bands/${bandId}`
        this.fs.getDoc(path).pipe(take(1)).subscribe((band: Band) => {
            if (band) {
                this.band = band;
                const bandMemberIds: string[] = band.bandMemberIds
                this.getBandMembers(bandMemberIds);
                // this.uiStore.setSubMenuItems(band)
                this.uiStore.setBand(band)
            } else {

                this.fs.getFirstDocument(`bands`)
                    .subscribe((band: Band) => {
                        this.band = band;
                        // console.log(band)
                        // this.uiStore.setSubMenuItems(band)
                        this.uiStore.setBand(band)
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
            concerts.forEach((concert: Concert) => {
                if (concert.date.seconds * 1000 > new Date().getTime())
                    upcomingConcerts.push(concert)
            })
            resolve(upcomingConcerts)
        })
        return promise
    }

    scrollToTop() {
        const targetElement = this.top.nativeElement
        targetElement.scrollIntoView({ behavior: 'smooth' })
    }
}
