import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Musician } from '../models/musician.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../auth/auth.store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-musician',
    imports: [MatIconModule, MatButtonModule, MatExpansionModule],
    templateUrl: './musician.component.html',
    styleUrl: './musician.component.scss'
})
export class MusicianComponent implements OnInit {
    @Input() public musician: Musician;
    @Input() editmode: boolean = false;
    @Output() removeMusician = new EventEmitter<string>;

    auth = inject(AuthStore)
    route = inject(ActivatedRoute)
    router = inject(Router)
    showDelete: boolean = false

    ngOnInit(): void {
        if ((this.router.url).includes('band-members')) {
            this.showDelete = true
        }


    }

    onRemoveMusician(id) {
        this.removeMusician.emit(id)
    }
}
