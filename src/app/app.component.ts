import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { UiStore } from './services/ui.store';
import { FooterComponent } from './navigation/footer/footer.component';
import { User as FirebaseUser } from "@angular/fire/auth";
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthStore } from './auth/auth.store';

import { FirestoreService } from './services/firestore.service';
import { Article } from './shared/models/article-models/ariticle.model';
import { UiService } from './services/ui.service';
import { VisibilityEyesComponent } from './shared/visibility-eyes/visibility-eyes.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatSidenavModule,
        SidenavComponent,
        HeaderComponent,
        FooterComponent,
        VisibilityEyesComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'oosterop';
    uiStore = inject(UiStore);
    afAuth = inject(Auth);
    authStore = inject(AuthStore)
    router = inject(Router);
    fs = inject(FirestoreService)
    uiService = inject(UiService)



    ngOnInit(): void {
        onAuthStateChanged(this.afAuth, (user: FirebaseUser) => {
            if (user) {
                // // console.log(user)
                this.authStore.persistLogin();
            } else {
                // // console.log(' no user')
            }
        })
        if (this.uiStore.article()) {
            // console.log(this.uiStore.article())
        } else {
            this.setLatestArticle();
            // // console.log('no article selected')
        }
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const url = event.urlAfterRedirects

                // this.uiService.navigationHistoryChanged.emit(url)
            }
        })
    }


    setLatestArticle() {
        this.fs.sortedCollection(`articles`, 'date', 'desc')

            .subscribe((articles: Article[]) => {
                // // console.log(articles)
                this.uiStore.setArticle(articles[0])
            })
    }
}
