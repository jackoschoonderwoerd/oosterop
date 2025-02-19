import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    private _snackBar = inject(MatSnackBar)

    openSnackbar(message: string) {
        this._snackBar.open(message, null, {
            duration: 10000
        })
    }
}
