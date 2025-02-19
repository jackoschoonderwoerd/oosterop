import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-warning',
    imports: [JsonPipe, MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './warning.component.html',
    styleUrl: './warning.component.scss'
})
export class WarningComponent {
    public data: any = inject(MAT_DIALOG_DATA)
}
