import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { Anouncement } from '../../../shared/models/anouncement.model';
import { take } from 'rxjs';
import { Musician } from '../../../shared/models/musician.model';

@Component({
    selector: 'app-visitor-anouncement',
    imports: [],
    templateUrl: './visitor-anouncement.component.html',
    styleUrl: './visitor-anouncement.component.scss'
})
export class VisitorAnouncementComponent implements OnInit {
    route = inject(ActivatedRoute)
    fs = inject(FirestoreService);
    anouncement: Anouncement;
    bandMembers: Musician[] = [];

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: any) => {
            const anouncementId = params.get('anouncementId')
            this.getAnouncement(anouncementId)

        })
    }

    getAnouncement(anouncementId: string) {
        const path = `anouncements/${anouncementId}`
        this.fs.getDoc(path)
            .pipe(take(1))
            .subscribe((anouncement: Anouncement) => {
                this.anouncement = anouncement;
                const bandMemerIds = this.anouncement.musiciansIds
                this.getBandMembers(bandMemerIds)
            })
    }
    getBandMembers(bandMemberIds: string[]) {
        bandMemberIds.forEach((memberId: string) => {
            this.bandMembers = [];
            const path = `musicians/${memberId}`
            this.fs.getDoc(path).pipe(take(1)).subscribe((musician: Musician) => {
                this.bandMembers.push(musician)
            })
        })
    }

}
