import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Musician } from '../models/musician.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../auth/auth.store';

@Component({
    selector: 'app-musician',
    imports: [MatIconModule, MatButtonModule],
    templateUrl: './musician.component.html',
    styleUrl: './musician.component.scss'
})
export class MusicianComponent {
    @Input() public musician: Musician;
    @Input() editmode: boolean = false;
    @Output() removeMusician = new EventEmitter<string>;
    auth = inject(AuthStore)

    onRemoveMusician(id) {
        this.removeMusician.emit(id)
    }
}
