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
        this.uiService.getBand(bandId)
        this.uiStore.setHomeSelected(false)
        this.uiService.scrollToTopContent.emit()
        // this.uiService.visitorBandComponentReady.subscribe(() => {
        //     console.log(`visitorBandComponentReady`)
        //     this.uiService.bandIdSelected.emit(bandId);
        // })
        // this.uiService.scrollToTopContent.emit();
        // this.uiService.bandIdSelected.emit(bandId);
        // this.router.navigateByUrl('home');
        // this.uiService.bandsVisible.emit();
        // this.uiStore.setHomeSelected(false);
        this.onClose()
    }

    onHome() {
        this.uiStore.setHomeSelected(true)
        // this.fs.sortedCollection(`articles`, 'date', 'asc')
        //     .subscribe((sortetArticles: Article[]) => {
        //         this.uiStore.setArticle(sortetArticles[0])
        //     })
        this.router.navigateByUrl('home')
        this.onClose()
    }
}
