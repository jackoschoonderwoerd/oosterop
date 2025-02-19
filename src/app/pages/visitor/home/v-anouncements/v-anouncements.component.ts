import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../../../services/firestore.service';
import { Anouncement } from '../../../../shared/models/anouncement.model';
import { VAnouncementComponent } from './v-anouncement/v-anouncement.component';
import { take } from 'rxjs';

@Component({
    selector: 'app-v-anouncements',
    imports: [VAnouncementComponent],
    templateUrl: './v-anouncements.component.html',
    styleUrl: './v-anouncements.component.scss'
})
export class VAnouncementsComponent {
    fs = inject(FirestoreService)

    anouncements: Anouncement[] = []
    ngOnInit(): void {
        this.getAnounceMents()
            .then((anouncements: Anouncement[]) => {
                this.anouncements = anouncements
            })
    }

    getAnounceMents(): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            const path = `anouncements`
            this.fs.collection(path).pipe(take(1))
                .subscribe((anouncements: Anouncement[]) => {
                    resolve(anouncements)
                })
        })
        return promise
    }
}
