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
import { UiService } from '../../services/ui.service';
import { FirestoreService } from '../../services/firestore.service';
import { Article } from '../../shared/models/article-models/ariticle.model';

interface BandsByInitiator {
    initiator: string;
    bands: Band[];

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
    uiStore = inject(UiStore);
    uiService = inject(UiService);
    fs = inject(FirestoreService)
    @Output() closeSidenav = new EventEmitter<void>();


    ngOnInit(): void {

        // this.bandsByInitiatorArray = this.navigationService.getBandsByInitiatorArray
        this.navigationService.getBandsByInitiatorArray().then((bandsByInitiatorArray: BandsByInitiator[]) => {
            this.bandsByInitiatorArray = bandsByInitiatorArray
        })
    }

    onClose() {
        this.closeSidenav.emit();
    }
    onBandSelected(bandId: string) {
        this.router.navigateByUrl('home')
        this.uiService.getBand(bandId)
        this.uiStore.setHomeSelected(false)
        this.uiService.scrollToTopContent.emit()
        this.onClose()
    }

    onHome() {
        this.uiStore.setHomeSelected(true)
        this.router.navigateByUrl('home')
        this.onClose()
    }
}
