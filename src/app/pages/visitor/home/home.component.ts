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
import { NewsBandsListComponent } from './news-bands-list/news-bands-list.component';
import { Router, RouterModule } from '@angular/router';
import { UiService } from '../../../services/ui.service';
import { UiStore } from '../../../services/ui.store';
import { VisitorBandComponent } from '../visitor-band/visitor-band.component';
import { VisitorNewsComponent } from '../visitor-news/visitor-news.component';
import { VisitorService } from '../visitor.service';



@Component({
    selector: 'app-home',
    imports: [
        LogoComponent,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        NewsBandsListComponent,
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
    visitorService = inject(VisitorService)
    articlesVisible: boolean = false;
    bandsVisible: boolean = true;

    ngOnInit(): void {

        this.uiService.bandsVisible.subscribe((visible: boolean) => {
            this.bandsVisible = visible
        })
        this.uiService.articlesVisible.subscribe((visible: boolean) => {
            this.articlesVisible = visible;
        })
        this.visitorService.scrollToTopContent.subscribe(() => {
            this.scrollToTopContent();
        })
    }

    onScrollToTop() {
        const targetElement = this.top.nativeElement
        targetElement.scrollIntoView({ behavior: 'smooth' })
    }

    scrollToTopContent() {
        const targetElement = this.topContent.nativeElement
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
