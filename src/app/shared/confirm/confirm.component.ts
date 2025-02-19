import { JsonPipe } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './confirm.component.html',
    styleUrl: './confirm.component.scss'
})
export class ConfirmComponent implements OnInit {

    dialog = inject(MatDialog)

    public data: any = inject(MAT_DIALOG_DATA);

    ngOnInit(): void {
        console.log(this.data)
    }

    getConfirmation(message) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: message
            }
        })
        const promise = new Promise((resolve, reject) => {
            dialogRef.afterClosed().subscribe((status: boolean) => {
                if (status) {
                    resolve(true)
                }
            })

        })
        return promise
    }

}
