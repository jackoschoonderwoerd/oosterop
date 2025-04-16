import { AuthStore } from '../../../auth/auth.store';
import { Band } from '../../../shared/models/band.model';
import { BehaviorSubject, take } from 'rxjs';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { LogoComponent } from '../logo/logo.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UiService } from '../../../services/ui.service';
import { UiStore } from '../../../services/ui.store';
import { VisitorBandComponent } from '../visitor-band/visitor-band.component';
import { VisitorNewsComponent } from '../visitor-news/visitor-news.component';

import { VisitorTourPeriodsComponent } from '../visitor-tour-periods/visitor-tour-periods.component';
import { BandsListComponent } from './bands-list/bands-list.component';
import { VisitorEventsComponent } from '../visitor-events/visitor-events.component';



@Component({
    selector: 'app-home',
    imports: [
        LogoComponent,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        BandsListComponent,
        RouterModule,
        VisitorBandComponent,
        VisitorNewsComponent,

    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

    @ViewChild('topContent') topContent
    @ViewChild('top') top

    uiService = inject(UiService);
    uiStore = inject(UiStore)
    router = inject(Router)
    authStore = inject(AuthStore);
    fs = inject(FirestoreService);

    articlesVisible: boolean = false;
    bandsVisible: boolean = true;
    route = inject(ActivatedRoute)

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            console.log(params)
            console.log(params['bandId'])
            const bandId = params['bandId']
            if (bandId) {
                this.uiService.getBand(bandId)
            }
        })
        this.uiService.bandsVisible.subscribe((visible: boolean) => {
            this.bandsVisible = visible
        })
        this.uiService.articlesVisible.subscribe((visible: boolean) => {
            this.articlesVisible = visible;
        })
        this.uiService.scrollToTopContent.subscribe(() => {
            this.scrollToTopContent();
            // this.onScrollToTop()
        })
    }

    onScrollToTop() {
        // console.log('onScrollToTop')
        const targetElement = this.top.nativeElement
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    scrollToTopContent() {
        // console.log('onScrollToTopContent')
        const targetElement = this.topContent.nativeElement
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }


}
