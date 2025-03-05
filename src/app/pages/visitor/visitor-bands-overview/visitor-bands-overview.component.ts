import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { Band } from '../../../shared/models/band.model';
import { take } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
    selector: 'app-visitor-bands-overview',
    imports: [JsonPipe, MatIconModule],
    templateUrl: './visitor-bands-overview.component.html',
    styleUrl: './visitor-bands-overview.component.scss'
})
export class VisitorBandsOverviewComponent {
    fs = inject(FirestoreService);
    bands: Band[];
    router = inject(Router)

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
        this.router.navigate(['visitor-band', { bandId }])
    }
}
