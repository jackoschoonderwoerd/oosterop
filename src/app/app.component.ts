import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { UiStore } from './services/ui.store';
import { FooterComponent } from './navigation/footer/footer.component';
import { User as FirebaseUser } from "@angular/fire/auth";
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthStore } from './auth/auth.store';
import { VisitorComponent } from './pages/visitor/visitor.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatSidenavModule,
        SidenavComponent,
        HeaderComponent,
        FooterComponent,
        VisitorComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'oosterop';
    uiStore = inject(UiStore);
    afAuth = inject(Auth);
    authStore = inject(AuthStore)

    ngOnInit(): void {
        onAuthStateChanged(this.afAuth, (user: FirebaseUser) => {
            if (user) {
                // console.log(user)
                this.authStore.persistLogin();
            } else {
                console.log(' no user')
            }
        })
    }
}
