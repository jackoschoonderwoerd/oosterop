import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../../services/firestore.service';
import { Musician } from '../../../shared/models/musician.model';
import { Router } from '@angular/router';
import { AddMusicianComponent } from '../bands/band/bandmembers-table/add-musician/add-musician.component';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmService } from '../../../shared/confirm/confirm.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-musicians',
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './musicians.component.html',
    styleUrl: './musicians.component.scss'
})
export class MusiciansComponent implements OnInit {

    musicians: Musician[] = []
    fs = inject(FirestoreService);
    router = inject(Router);
    confirmService = inject(ConfirmService);
    sb = inject(SnackbarService)

    ngOnInit(): void {
        const path = `musicians`
        this.fs.sortedCollection(path, 'name', 'asc')
            .subscribe((musicians: Musician[]) => {
                this.musicians = musicians
            })
    }

    onAddMusician() {
        this.router.navigateByUrl('add-musician')
    }
    onEdit(id) {
        this.router.navigate(['add-musician', { id }])
    }
    onDelete(id) {
        this.confirmService.getConfirmation(id)
            .then((res: boolean) => {
                if (res) {
                    const path = `musicians/${id}`
                    this.fs.deleteDoc(path)
                        .then((res: any) => {

                        })
                        .catch((err: FirebaseError) => {
                            console.log(err)
                            this.sb.openSnackbar(`operation failed due to ${err.message}`)
                        })
                } else {
                    this.sb.openSnackbar('operation aborted by user')
                }

            })

    }
}
