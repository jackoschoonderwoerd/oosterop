import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { UiStore } from './services/ui.store';
import { FooterComponent } from './navigation/footer/footer.component';
import { User as FirebaseUser } from "@angular/fire/auth";
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthStore } from './auth/auth.store';
import { VisitorComponent } from './pages/visitor/visitor.component';
import { LogoComponent } from './pages/visitor/logo/logo.component';
import { FirestoreService } from './services/firestore.service';
import { Article } from './shared/models/article-models/ariticle.model';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatSidenavModule,
        SidenavComponent,
        HeaderComponent,
        FooterComponent,
        VisitorComponent,
        LogoComponent
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

    ngOnInit(): void {
        onAuthStateChanged(this.afAuth, (user: FirebaseUser) => {
            if (user) {
                // console.log(user)
                this.authStore.persistLogin();
            } else {
                console.log(' no user')
            }
        })
        if (this.uiStore.article()) {
            console.log(this.uiStore.article())
        } else {
            this.setLatestArticle();
            console.log('no article selected')
        }
    }
    setLatestArticle() {
        this.fs.sortedCollection(`articles`, 'date', 'asc')
            .subscribe((articles: Article[]) => {
                this.uiStore.setArticle(articles[0])
            })
    }
}
