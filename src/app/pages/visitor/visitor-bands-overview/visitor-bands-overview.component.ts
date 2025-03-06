import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { Band } from '../../../shared/models/band.model';
import { take } from 'rxjs';
import { JsonPipe, ViewportScroller } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthStore } from '../../../auth/auth.store';
import { UiStore } from '../../../services/ui.store';

@Component({
    selector: 'app-visitor-bands-overview',
    imports: [JsonPipe, MatIconModule],
    templateUrl: './visitor-bands-overview.component.html',
    styleUrl: './visitor-bands-overview.component.scss'
})
export class VisitorBandsOverviewComponent {
    fs = inject(FirestoreService);
    bands: Band[];
    router = inject(Router);
    authStore = inject(AuthStore)
    uiStore = inject(UiStore);
    viewportScroller = inject(ViewportScroller)

    @Output() bandSelected = new EventEmitter<void>();

    constructor() {
        this.getBands()
    }

    private getBands() {
        this.fs.sortedCollection(`bands`, 'name', 'asc')
            .pipe(take(1))
            .subscribe((bands: Band[]) => {
                this.bands = bands
            })

    }
    onBandInfo(bandId: string) {
        this.bandSelected.emit()
        this.router.navigate(['visitor-band', { bandId }])
    }
}
