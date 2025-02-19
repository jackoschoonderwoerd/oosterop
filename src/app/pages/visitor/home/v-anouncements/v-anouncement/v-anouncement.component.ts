import { Component, inject, Input, OnInit } from '@angular/core';
import { Anouncement } from '../../../../../shared/models/anouncement.model';
import { Musician } from '../../../../../shared/models/musician.model';
import { FirestoreService } from '../../../../../services/firestore.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { Review } from '../../../../../shared/models/review.model';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
    selector: 'app-v-anouncement',
    imports: [JsonPipe, DatePipe, MatExpansionModule],
    templateUrl: './v-anouncement.component.html',
    styleUrl: './v-anouncement.component.scss'
})
export class VAnouncementComponent implements OnInit {
    @Input() public anouncement: Anouncement

    fs = inject(FirestoreService)
    participants: Musician[] = [];
    reviews: Review[]

    ngOnInit(): void {
        this.getMusiciansIds()
            .then((musiciansIds: string[]) => {
                this.getParticipants(musiciansIds)
            })
        this.getReviews()
            .then((reviews: Review[]) => {
                this.reviews = reviews
            })
    }
    getMusiciansIds() {
        const promise = new Promise((resolve, reject) => {
            const path = `anouncements/${this.anouncement.id}`
            this.fs.getFieldInDocument(path, 'musiciansIds')
                .then((musiciansIds: string[]) => {
                    resolve(musiciansIds)
                })
        })
        return promise
    }
    getParticipants(musiciansIds: string[]) {
        musiciansIds.forEach((id: string) => {
            const path = `musicians/${id}`
            this.fs.getDoc(path)
                .subscribe((participant: Musician) => {
                    this.participants.push(participant)
                })
        })
    }
    getReviews() {
        const promise = new Promise((resolve, reject) => {
            const path = `anouncements/${this.anouncement.id}`
            this.fs.getFieldInDocument(path, 'reviews')
                .then((reviews: Review[]) => {
                    resolve(reviews)
                })
        })
        return promise
    }

}
