import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
        VisitorBandTourPeriodsComponent
    ],
    templateUrl: './visitor-band.component.html',
    styleUrl: './visitor-band.component.scss'
})
export class VisitorBandComponent implements OnInit {
    route = inject(ActivatedRoute)
    fs = inject(FirestoreService)
    band: Band;
    bandMembers: Musician[] = [];
    navigationService = inject(NavigationService)
    subMenuItems: string[] = [];
    uiStore = inject(UiStore);
    panelExpanded: boolean = false;
    // newConcerts: Concert[] = [];
    // pastConcerts: Concert[] = []
    concerts: Concert[] = [];

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: any) => {
            const bandId = params.get('bandId')
            this.bandMembers = [];
            this.getBand(bandId)
        })
    }
    getBand(bandId: string) {
        const path = `bands/${bandId}`
        this.fs.getDoc(path).pipe(take(1)).subscribe((band: Band) => {
            this.band = band;
            // this.concerts = band.concerts
            const bandMemberIds: string[] = band.bandMemberIds
            this.getBandMembers(bandMemberIds);
            // this.getSubMenuItems(band)
            this.uiStore.setSubMenuItems(band)
            this.uiStore.setBand(band)
            // this.splitConcertsPastNew(band.concerts)
            // this.navigationService.getSubMenuItems(this.band)

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

    // onPeriodSelected(event: Event, period: string) {
    //     event.stopPropagation();

    //     console.log(period);
    //     if (period === 'new') {
    //         this.concerts = this.getNewConcerts()
    //     } else if (period === 'past') {
    //         this.concerts = this.getPastConcerts()
    //     }
    // }

    // onPanelClicked(panel: MatExpansionPanel) {
    //     this.panelExpanded = panel.expanded
    // }

    // getPastConcerts() {
    //     let newConcerts: Concert[] = []
    //     this.band.concerts.forEach((concert: Concert) => {
    //         if (new Date(concert.date.seconds * 1000) < new Date) {
    //             newConcerts.push(concert)
    //         }
    //     })
    //     return newConcerts

    // }
    // getNewConcerts() {
    //     let newConcerts: Concert[] = []
    //     this.band.concerts.forEach((concert: Concert) => {
    //         if (new Date(concert.date.seconds * 1000) >= new Date) {
    //             newConcerts.push(concert)
    //         }
    //     })
    //     return newConcerts
    // }



    // splitConcertsPastNew(concerts: Concert[]) {
    //     concerts.forEach((concert: Concert) => {
    //         if (new Date(concert.date.seconds * 1000) > new Date) {
    //             this.concerts.push(concert)
    //         } else {
    //             this.concerts.push(concert)
    //         }
    //     })
    //     console.log(this.concerts)
    //     // console.log(this.pastConcerts)
    // }

    // getSubMenuItems(band: Band) {

    //     if (band.reviews && band.reviews.length > 0) {
    //         this.subMenuItems.push('reviews')
    //     }
    //     if (band.galleryVideos && band.galleryVideos.length > 0) {
    //         this.subMenuItems.push('videos')
    //     }
    //     if (band.galleryImages && band.galleryImages.length > 0) {
    //         this.subMenuItems.push('images')
    //     }
    //     if (band.galleryAudios && band.galleryAudios.length > 0) {
    //         this.subMenuItems.push('audio')
    //     }
    //     if (band.concerts && band.concerts.length > 0) {
    //         this.subMenuItems.push('concerts')
    //     }
    //     console.log(this.subMenuItems)
    // }

}
