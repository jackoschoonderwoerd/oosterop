import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'
import { MatListModule } from '@angular/material/list'
import { NavigationService } from '../navigation.service';
import { MenuItem } from '../../shared/models/menu-item.model';
import { Router, RouterModule } from '@angular/router';
import { Band } from '../../shared/models/band.model';
import { MatMenuModule } from '@angular/material/menu';
import { UiStore } from '../../services/ui.store';

interface BandsByInitiator {
    initiator: string;
    bands: Band[]
}

@Component({
    selector: 'app-sidenav',
    imports: [MatIconModule, MatButtonModule, MatListModule, RouterModule, MatMenuModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {
    navigationService = inject(NavigationService)
    bandsByInitiatorArray: BandsByInitiator[] = []
    router = inject(Router)
    uiStore = inject(UiStore)
    @Output() closeSidenav = new EventEmitter<void>();

    sideNavMenuItems: MenuItem[];

    ngOnInit(): void {
        this.sideNavMenuItems = this.navigationService.getSideNavMenuItems();
        // this.bandsByInitiatorArray = this.navigationService.getBandsByInitiatorArray
        this.navigationService.getBandsByInitiatorArray().then((bandsByInitiatorArray: BandsByInitiator[]) => {
            this.bandsByInitiatorArray = bandsByInitiatorArray
        })
    }

    onClose() {
        this.closeSidenav.emit();
    }
    onBandSelected(bandId: string) {
        console.log(bandId);
        // return;
        this.router.navigate(['visitor-band', { bandId }])
        this.uiStore.setBandId(bandId)
        this.onClose()

    }
}
