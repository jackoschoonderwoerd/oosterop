import { Component, inject, OnInit } from '@angular/core';
import { VAnouncementsComponent } from './v-anouncements/v-anouncements.component';
import { Anouncement } from '../../../shared/models/anouncement.model';
import { FirestoreService } from '../../../services/firestore.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../../auth/auth.store';
import { BandMenuItem } from '../../../shared/models/band-menu-item.model';
import { BehaviorSubject, take } from 'rxjs';
import { Band } from '../../../shared/models/band.model';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Observable } from 'tinymce';
import { LogoComponent } from '../logo/logo.component';
import { VisitorTourPeriodsComponent } from '../visitor-tour-periods/visitor-tour-periods.component';
import { VisitorBandsOverviewComponent } from '../visitor-bands-overview/visitor-bands-overview.component';
import { VisitorEventsComponent } from '../visitor-events/visitor-events.component';
import { VisitorNewsComponent } from '../visitor-news/visitor-news.component';
import { ArticlesListComponent } from '../../admin/news/articles-list/articles-list.component';
import { VisitorBandComponent } from '../visitor-band/visitor-band.component';
import { UiService } from '../../../services/ui.service';
import { NewsBandsListComponent } from './news-bands-list/news-bands-list.component';
import { UiStore } from '../../../services/ui.store';



@Component({
    selector: 'app-home',
    imports: [
        VAnouncementsComponent,
        MatToolbarModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        JsonPipe,
        AsyncPipe,
        LogoComponent,
        VisitorTourPeriodsComponent,
        VisitorBandsOverviewComponent,
        VisitorEventsComponent,
        VisitorNewsComponent,
        ArticlesListComponent,
        VisitorBandComponent,
        NewsBandsListComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

    bandsSubject = new BehaviorSubject<Band[]>(null)

    bands$: any = this.bandsSubject.asObservable()
    router = inject(Router)
    authStore = inject(AuthStore);
    fs = inject(FirestoreService);
    items: string[] = ['item 1', 'item 2'];
    // viewArtists: boolean = true;
    articlesVisible: boolean = false;
    bandsVisible: boolean = true;
    uiService = inject(UiService);
    uiStore = inject(UiStore)

    ngOnInit(): void {
        this.fs.collection(`bands`)
            .pipe(take(1))
            .subscribe((bands: Band[]) => {
                this.bandsSubject.next(bands)
                this.bands$ = this.bandsSubject.asObservable()
            })
        this.uiService.bandsVisible.subscribe((visible: boolean) => {
            this.bandsVisible = visible
        })
        this.uiService.articlesVisible.subscribe((visible: boolean) => {
            this.articlesVisible = visible
        })
    }

    onLogin() {
        this.router.navigateByUrl('login')
    }
    onBandSelected(bandId: string) {
        console.log(bandId)
        this.router.navigate(['visitor/visitor-band', bandId])
    }
}
