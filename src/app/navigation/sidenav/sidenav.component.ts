import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'
import { MatListModule } from '@angular/material/list'
import { NavigationService } from '../navigation.service';
import { MenuItem } from '../../shared/models/menu-item.model';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidenav',
    imports: [MatIconModule, MatButtonModule, MatListModule, RouterModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {
    navigationService = inject(NavigationService)

    @Output() closeSidenav = new EventEmitter<void>();

    sideNavMenuItems: MenuItem[];

    ngOnInit(): void {
        this.sideNavMenuItems = this.navigationService.getSideNavMenuItems()
    }

    onClose() {
        this.closeSidenav.emit();
    }
}
