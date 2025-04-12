import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../auth/auth.store';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    imports: [MatIconModule, MatButtonModule, RouterModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    authStore = inject(AuthStore)

    onLogout() {
        this.authStore.logout();
    }
}
