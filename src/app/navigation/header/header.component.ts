import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationService } from '../navigation.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { UiStore } from '../../services/ui.store';
import { AuthStore } from '../../auth/auth.store';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Band } from '../../shared/models/band.model';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Anouncement } from '../../shared/models/anouncement.model';

interface BandsByInitiator {
    initiator: string;
    bands: Band[]
}

@Component({
    selector: 'app-header',
    imports: [
        MatToolbarModule,
        RouterModule,
        MatIconModule,
        AsyncPipe,
        MatMenuModule,
        MatButtonModule,
        JsonPipe
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

    anouncementsSubject = new BehaviorSubject<Anouncement[]>(null);
    anouncements$: any = this.anouncementsSubject.asObservable();

    bandsSubject = new BehaviorSubject<Band[]>(null);
    bands$: any = this.bandsSubject.asObservable();

    fs = inject(FirestoreService)
    navigationService = inject(NavigationService);
    uiStore = inject(UiStore)
    authStore = inject(AuthStore);
    adminMenuItems: string[] = [];
    visitorMenuItems: string[] = [];
    router = inject(Router);
    subMenuItems: string[] = []
    bandsByInitiatorArray: BandsByInitiator[] = []
    // bands$: Observable<Band[]>

    @Output() sidenavToggle = new EventEmitter<void>();



    ngOnInit(): void {

        this.visitorMenuItems = this.navigationService.getVisitorMenuItems();
        this.adminMenuItems = this.navigationService.getAdminMenuItems();
        this.getBands();
        this.getAnouncements();

    }
    getBands() {
        this.fs.sortedCollection('bands', 'seqNr', 'asc')
            .pipe(take(1))
            .subscribe((bands: Band[]) => {
                this.sortBandsByInitiator(bands);
                // return;
                this.bandsSubject.next(bands)
                this.bands$ = this.bandsSubject.asObservable();
            })
    }
    getAnouncements() {
        this.fs.sortedCollection('anouncements', 'seqNr', 'asc')
            .pipe(take(1))
            .subscribe((anouncements: Anouncement[]) => {
                this.anouncementsSubject.next(anouncements)
                this.anouncements$ = this.anouncementsSubject.asObservable()
            })
    }
    onBandSelected(bandId: string) {
        console.log(bandId);
        // return;
        this.router.navigate(['visitor-band', { bandId }])
        this.uiStore.setBandId(bandId)

    }
    onAnouncementSelected(anouncementId: string) {
        this.router.navigate(['visitor-anouncement', { anouncementId }])
    }
    onVisitorTourPeriods() {
        this.router.navigateByUrl('visitor-tour-periods');
    }


    onToggleSidenav() {
        console.log('toggle')
        this.sidenavToggle.emit();
    }
    onLogout() {
        this.authStore.logout();
    }



    sortBandsByInitiator(bands: Band[]) {
        // let bandsByInitiatorArray: BandsByInitiator[] = []
        // create empty arrays
        bands.forEach((band: Band) => {
            const bandsByInitiator: BandsByInitiator = {
                initiator: band.initiator ? band.initiator : band.name,
                bands: []
            }
            this.bandsByInitiatorArray.push(bandsByInitiator);
        })
        // remove duplicates
        this.bandsByInitiatorArray = [...new Map(this.bandsByInitiatorArray.map(obj => [obj.initiator, obj])).values()];
        console.log(this.bandsByInitiatorArray)

        // add bands to initiator

        bands.forEach((band: Band) => {
            // console.log(band)
            this.bandsByInitiatorArray.forEach((bandsByInitator: BandsByInitiator, index) => {
                if (band.initiator === bandsByInitator.initiator) {
                    this.bandsByInitiatorArray[index].bands.push(band)
                }
            })
        })
        console.log(this.bandsByInitiatorArray)

    }
}
