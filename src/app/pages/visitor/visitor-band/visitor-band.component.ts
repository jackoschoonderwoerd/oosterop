import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { Band } from '../../../shared/models/band.model';
import { take } from 'rxjs';
import { Musician } from '../../../shared/models/musician.model';
import { MusicianComponent } from '../../../shared/musician/musician.component';

@Component({
    selector: 'app-visitor-band',
    imports: [MusicianComponent],
    templateUrl: './visitor-band.component.html',
    styleUrl: './visitor-band.component.scss'
})
export class VisitorBandComponent implements OnInit {
    route = inject(ActivatedRoute)
    fs = inject(FirestoreService)
    band: Band;
    musicians: Musician[] = [];

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: any) => {
            const bandId = params.get('bandId')
            this.getBand(bandId)
        })
    }
    getBand(bandId: string) {
        const path = `bands/${bandId}`
        this.fs.getDoc(path).pipe(take(1)).subscribe((band: Band) => {
            this.band = band;
            const bandMemberIds: string[] = band.bandMemberIds
            this.getBandMembers(bandMemberIds)

        })

    }
    getBandMembers(bandMemberIds: string[]) {
        bandMemberIds.forEach((memberId: string) => {
            this.musicians = [];
            const path = `musicians/${memberId}`
            this.fs.getDoc(path).pipe(take(1)).subscribe((musician: Musician) => {
                this.musicians.push(musician)
            })
        })
    }
}
