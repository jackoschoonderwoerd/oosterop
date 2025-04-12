import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationService } from '../navigation.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { UiStore } from '../../services/ui.store';
import { AuthStore } from '../../auth/auth.store';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Band } from '../../shared/models/band.model';
import { AsyncPipe, JsonPipe, Location, NgClass } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Anouncement } from '../../shared/models/anouncement.model';
import { VisitorBandsMenuComponent } from '../../pages/visitor/visitor-bands-menu/visitor-bands-menu.component';
import { UiService } from '../../services/ui.service';
import { Article } from '../../shared/models/article-models/ariticle.model';
import { NavigationHistoryService } from '../navigation-history.service';

interface BandsByInitiator {
    initiator: string;
    bands: Band[]
}

@Component({
    selector: 'app-header',
    imports: [
        NgClass,
        MatToolbarModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
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
    router = inject(Router);
    uiStore = inject(UiStore)
    uiSercie = inject(UiService)
    authStore = inject(AuthStore);
    location = inject(Location);
    uiService = inject(UiService);
    // navigationHistoryService = inject(NavigationHistoryService)

    private history: string[] = [];
    private future: string[] = [];


    subMenuItems: string[] = []
    bandsByInitiatorArray: BandsByInitiator[] = [];


    @Output() sidenavToggle = new EventEmitter<void>();



    ngOnInit(): void {


        this.navigationService.getBandsByInitiatorArray()
            .then((bandsByInitiatorArray: BandsByInitiator[]) => {
                this.bandsByInitiatorArray = bandsByInitiatorArray
            })
            .catch((err: any) => {
                // console.log(err);
            })
        // this.uiSercie.navigationHistoryChanged.subscribe((currentUrl: string) => {

        // this.navigationHistoryService.updateNavigationHistory(currentUrl)

        // })

    }


    onToggleSidenav() {
        // console.log('toggle')
        this.sidenavToggle.emit();
    }
    // onLogout() {
    //     this.authStore.logout();
    // }


    goToPreviousPage() {

        // const prevUrl = this.navigationHistoryService.back();
        // if (prevUrl) {
        //     this.router.navigateByUrl(prevUrl);
        // }
    }
    goToNextPage() {
        // const nextUrl = this.navigationHistoryService.forward();
        // if (nextUrl) {
        //     this.router.navigateByUrl(nextUrl);
        // }
    }
    toggleHidden() {
        // console.log(this.uiStore.showHidden())
        this.uiStore.setShowHidden(!this.uiStore.showHidden())
    }

    onHome() {
        this.uiStore.setHomeSelected(true)
        // this.fs.sortedCollection(`articles`, 'date', 'asc')
        //     .subscribe((sortetArticles: Article[]) => {
        //         this.uiStore.setArticle(sortetArticles[0])
        //     })
        this.router.navigateByUrl('home')
    }

}
