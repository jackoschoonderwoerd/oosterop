import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { ConfirmComponent } from './confirm.component';
import { JsonPipe } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';


@Injectable({
    providedIn: 'root'
})
export class ConfirmService {

    dialog = inject(MatDialog);
    sb = inject(SnackbarService)


    constructor() { }

    getConfirmation(doomedElement) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement
            }
        })
        const promise = new Promise((resolve, reject) => {

            dialogRef.afterClosed().subscribe((confirmation: boolean) => {
                if (confirmation) {
                    resolve(true)
                } else {
                    this.sb.openSnackbar('action aborted by user')
                }
            })
        })
        return promise
    }
}
