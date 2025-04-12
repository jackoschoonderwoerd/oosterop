import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { Band } from '../../../../shared/models/band.model';
import { MatButtonModule } from '@angular/material/button';
import { Musician } from '../../../../shared/models/musician.model';
import { take } from 'rxjs';
import { MusicianComponent } from '../../../../shared/musician/musician.component';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-band',
    imports: [
        MatButtonModule,
        MusicianComponent,
        DatePipe,
        JsonPipe,
        MatIconModule
    ],
    templateUrl: './band.component.html',
    styleUrl: './band.component.scss'
})
export class BandComponent implements OnInit {
    route = inject(ActivatedRoute)
    bandId: string;
    fs = inject(FirestoreService)
    band: Band;
    router = inject(Router);
    bandMembers: Musician[] = []


    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        // console.log(this.bandId)
        this.getBand()
            .subscribe((band: Band) => {
                this.band = band;
                this.getBandMembers()
            })
    }
    getBand() {
        const path = `bands/${this.bandId}`
        return this.fs.getDoc(path)
    }

    getBandMembers() {
        if (this.band.bandMemberIds) {
            this.band.bandMemberIds.forEach((bandMemberId: string) => {
                const path = `musicians/${bandMemberId}`
                this.fs.getDoc(path)
                    .pipe(take(1))
                    .subscribe((bandMember: Musician) => {
                        this.bandMembers.push(bandMember)
                    })
            })
        }
    }


    onPrimary() {
        this.router.navigate(['add-band', { bandId: this.bandId }])
    }
    onBandMembers() {
        this.router.navigate(['band-bandmembers', { bandId: this.bandId }])
    }
    onOImages() {
        this.router.navigate(['band-images', { bandId: this.bandId }])
    }
    onBody() {
        this.router.navigate(['band-body', { bandId: this.bandId }])
    }
    onLinks() {
        this.router.navigate(['band-links', { bandId: this.bandId }])
    }
    onReviews() {
        this.router.navigate(['band-reviews', { bandId: this.bandId }])
    }
    onRecordings() {
        this.router.navigate(['band-recordings', { bandId: this.bandId }])
    }
    onQuotes() {
        this.router.navigate(['band-quotes', { bandId: this.bandId }])
    }
    onOAudio() {
        this.router.navigate(['band-audio', { bandId: this.bandId }])
    }
    onConcerts() {
        this.router.navigate(['band-concerts', { bandId: this.bandId }])
    }
    onTourPeriods() {
        this.router.navigate(['band-tour-periods', { bandId: this.bandId }])
    }
    onCancel() {
        this.router.navigateByUrl('bands')
    }
}
