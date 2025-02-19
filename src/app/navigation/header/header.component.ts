import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationService } from '../navigation.service';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { UiStore } from '../../services/ui.store';
import { AuthStore } from '../../auth/auth.store';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, RouterModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    navigationService = inject(NavigationService);
    uiStore = inject(UiStore)
    authStore = inject(AuthStore);

    adminMenuItems: string[] = [];
    visitorMenuItems: string[] = []

    @Output() sidenavToggle = new EventEmitter<void>();

    ngOnInit(): void {
        this.visitorMenuItems = this.navigationService.getVisitorMenuItems()
        this.adminMenuItems = this.navigationService.getAdminMenuItems()
    }

    onToggleSidenav() {
        console.log('toggle')
        this.sidenavToggle.emit();
    }
    onLogout() {
        this.authStore.logout();
    }
}
