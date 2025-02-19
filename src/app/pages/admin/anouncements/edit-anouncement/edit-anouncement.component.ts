import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Anouncement } from '../../../../shared/models/anouncement.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { Musician } from '../../../../shared/models/musician.model';
import { take } from 'rxjs';
import { MusicianComponent } from '../../../../shared/musician/musician.component';

@Component({
    selector: 'app-edit-anouncement',
    imports: [MatButtonModule, MusicianComponent],
    templateUrl: './edit-anouncement.component.html',
    styleUrl: './edit-anouncement.component.scss'
})
export class EditAnouncementComponent implements OnInit {

    router = inject(Router)
    route = inject(ActivatedRoute)
    anouncementId: string;
    anouncement: Anouncement;
    fs = inject(FirestoreService)
    participants: Musician[] = [];
    path: string;


    ngOnInit(): void {
        this.anouncementId = this.route.snapshot.paramMap.get('anouncementId');
        this.path = `anouncements/${this.anouncementId}`
        this.getAnouncement()
            .subscribe((anouncement: Anouncement) => {
                this.anouncement = anouncement;
                this.getMusicians(anouncement.musiciansIds)
            })
    }
    getAnouncement() {
        return this.fs.getDoc(this.path)
    }
    getMusicians(musiciansIds: string[]) {
        musiciansIds.forEach((id: string) => {
            const path = `musicians/${id}`
            this.fs.getDoc(path)
                .pipe(take(1))
                .subscribe((musician: Musician) => {
                    this.participants.push(musician)
                })
        })
    }
    onPrimary() {
        this.router.navigate(['add-anouncement', { anouncementId: this.anouncementId }])
    }

    onBody() {
        this.router.navigate(['add-body', { anouncementId: this.anouncementId }])
    }

    onParticipants() {
        this.router.navigate(['add-participants', { anouncementId: this.anouncementId }])
    }

    onReviews() {
        this.router.navigate(['add-review', { anouncementId: this.anouncementId }])
    }
    onImages() {
        this.router.navigate(['add-images', { anouncementId: this.anouncementId }])
    }
    onCancel() {
        this.router.navigateByUrl('anouncements')
    }
}
