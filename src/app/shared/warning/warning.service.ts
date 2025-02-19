import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from './warning.component';

@Injectable({
    providedIn: 'root'
})
export class WarningService {

    dialog = inject(MatDialog)
    constructor() { }

    showWarning(message: string) {
        this.dialog.open(WarningComponent, {
            data: { message }
        })
    }

}
