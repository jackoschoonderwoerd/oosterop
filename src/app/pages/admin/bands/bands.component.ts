import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { Band } from '../../../shared/models/band.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FirebaseError, FirebaseServerApp } from '@angular/fire/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from '../../../shared/warning/warning.component';
;

@Component({
    selector: 'app-bands',
    imports: [MatButtonModule, MatIconModule, JsonPipe, ConfirmComponent, WarningComponent],
    templateUrl: './bands.component.html',
    styleUrl: './bands.component.scss'
})
export class BandsComponent {

    fb = inject(FormBuilder)
    router = inject(Router)
    fs = inject(FirestoreService);
    bands: Band[] = [];
    sb = inject(SnackbarService);
    dialog = inject(MatDialog)

    private bandsSubject = new BehaviorSubject<Band[]>(null);
    bands$: Observable<Band[]> = this.bandsSubject.asObservable()

    private exhibitionSubject = new BehaviorSubject<Band[]>(null)
    exhibition$: Observable<Band[]> = this.exhibitionSubject.asObservable()

    ngOnInit(): void {
        const path = `bands`
        this.fs.sortedCollection(path, 'name', 'asc')
            .subscribe((bands: Band[]) => {
                // bands.forEach((band: Band) => {
                //     console.log(band.concerts, band.name)
                // })
                this.bandsSubject.next(bands)
                this.bands = bands
            })
    }

    getBands() {
        const path = `bands`
        this.fs.sortedCollection(path, 'seqNr', 'asc')
            .subscribe((bands: Band[]) => {
                console.log(bands.length)
                if (bands.length) {
                    this.bands = bands
                } else {
                    this.sb.openSnackbar('no bands')
                }
            })
    }

    onAddBand() {
        this.router.navigateByUrl('add-band')
    }
    onEdit(bandId: string) {
        this.router.navigate(['band', { bandId }])
    }
    onDelete(id: string, name: string) {
        this.dialog.open(WarningComponent, {
            data: {
                message: 'temporarily disabled'
            }
        })
        return;
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: name
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {

                const path = `bands/${id}`
                this.fs.deleteDoc(path)
                    .then((res: any) => {
                        console.log(res)
                        this.getBands();
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err)
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar(`operation aborted by user`)
            }
        })
    }

}
