import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { Band } from '../../../../shared/models/band.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-band',
    imports: [MatButtonModule],
    templateUrl: './band.component.html',
    styleUrl: './band.component.scss'
})
export class BandComponent implements OnInit {
    route = inject(ActivatedRoute)
    bandId: string;
    fs = inject(FirestoreService)
    band: Band;
    router = inject(Router)


    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        console.log(this.bandId)
        this.getBand()
            .subscribe((band: Band) => {
                this.band = band;
            })
    }
    getBand() {
        const path = `bands/${this.bandId}`
        return this.fs.getDoc(path)
    }
    onPrimary() {
        this.router.navigate(['add-band', { bandId: this.bandId }])
    }
    onBandMembers() {
        this.router.navigate(['band-members', { bandId: this.bandId }])
    }
    onOImages() {
        this.router.navigate(['band-images', { bandId: this.bandId }])
    }
    onCancel() {
        this.router.navigateByUrl('bands')
    }
}
