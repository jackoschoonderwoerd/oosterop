import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Musician } from '../../../../../shared/models/musician.model';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Anouncement } from '../../../../../shared/models/anouncement.model';
import { MatIconModule } from '@angular/material/icon';
import { WarningService } from '../../../../../shared/warning/warning.service';
import { MusicianSelectorComponent } from '../../../../../shared/musician-selector/musician-selector.component';

@Component({
    selector: 'app-add-participant',
    imports: [MatMenuModule, MatButtonModule, MatIconModule, MusicianSelectorComponent],
    templateUrl: './add-participants.component.html',
    styleUrl: './add-participants.component.scss'
})
export class AddParticipantsComponent implements OnInit {
    participants: Musician[] = [];
    musicians: Musician[];
    fs = inject(FirestoreService)
    sb = inject(SnackbarService)
    route = inject(ActivatedRoute);
    router = inject(Router)
    anouncement: Anouncement;
    warningService = inject(WarningService)

    ngOnInit(): void {
        this.getMusicians()
        const anouncementId = this.route.snapshot.paramMap.get('anouncementId')
        if (anouncementId) {
            this.getAnouncement(anouncementId)
                .then((anouncement: Anouncement) => {
                    this.anouncement = anouncement
                    return anouncement.musiciansIds
                })
                .then((musicianIds: string[]) => {
                    if (musicianIds.length) {
                        console.log(musicianIds)
                        this.getParticipants(musicianIds)
                    }
                })
        }

    }
    getAnouncement(anouncementId) {
        const path = `anouncements/${anouncementId}`
        const promise = new Promise((resolve, reject) => {
            this.fs.getDoc(path)
                .subscribe((anouncement: Anouncement) => {
                    if (anouncement) {
                        resolve(anouncement)
                    }
                })
        })
        return promise
    }

    getMusicians() {
        const path = `musicians`
        this.fs.collection(path)
            .pipe(take(1)).subscribe((musicians: Musician[]) => {
                this.musicians = musicians
            })
    }

    getParticipants(musicianIds: string[]) {
        if (musicianIds && musicianIds.length > 0) {
            console.log(musicianIds)
            musicianIds.forEach((id: string) => {
                const path = `musicians/${id}`
                this.fs.getDoc(path).pipe(take(1))
                    .subscribe((musician: Musician) => {
                        this.participants.push(musician)
                    })
            })
        }
    }

    musicianIdSelected(musicianId: string) {
        console.log(musicianId)
        if (this.checkForIdenticalMusicianId(musicianId)) {
            this.warningService.showWarning('paricipant already added')
        } else {
            const path = `anouncements/${this.anouncement.id}`
            this.fs.addElementToArray(path, 'musiciansIds', musicianId)
                .then((res: any) => {
                    console.log(res);
                    // this.addMusicianToparticipants(id)
                    this.updateParticipants()
                })
                .catch((err: FirebaseError) => {
                    console.log(err);
                    this.sb.openSnackbar(`operation failed due to ${err.message}`)
                })
        }
    }




    removeParticipant(musicianId: string, index) {
        const path = `anouncements/${this.anouncement.id}`
        console.log(path)
        this.fs.removeElementFromArray(path, 'musiciansIds', musicianId)
            .then((res: any) => {
                console.log(res)
                this.updateParticipants();
                this.updateAnouncementMusiciansIds(index)
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to ${err.message}`)
            })
    }
    updateParticipants() {
        this.participants = [];
        const path = `anouncements/${this.anouncement.id}`
        this.fs.getFieldInDocument(path, 'musiciansIds')
            .then((ids: string[]) => {
                this.getParticipants(ids)
            })

    }

    private checkForIdenticalMusicianId(musicianId: string) {
        return (this.anouncement.musiciansIds.includes(musicianId))
    }

    updateAnouncementMusiciansIds(index: number) {
        this.anouncement.musiciansIds = this.anouncement.musiciansIds.splice(index, 1)
    }

    onCancel() {
        this.router.navigate(['edit-anouncement', { anouncementId: this.anouncement.id }])
    }
}
