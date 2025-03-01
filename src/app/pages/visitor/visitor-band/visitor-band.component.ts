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
import { MatExpansionModule } from '@angular/material/expansion';

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
        DatePipe
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
    uiStore = inject(UiStore)

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
            const bandMemberIds: string[] = band.bandMemberIds
            this.getBandMembers(bandMemberIds);
            // this.getSubMenuItems(band)
            this.uiStore.setSubMenuItems(band)
            this.uiStore.setBand(band)
            // this.navigationService.getSubMenuItems(this.band)

        })

    }
    getBandMembers(bandMemberIds: string[]) {
        bandMemberIds.forEach((memberId: string) => {
            this.bandMembers = [];
            const path = `musicians/${memberId}`
            this.fs.getDoc(path).pipe(take(1)).subscribe((bandMember: Musician) => {
                this.bandMembers.push(bandMember)
            })
        })
    }
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
