import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Musician } from '../models/musician.model';
import { FirestoreService } from '../../services/firestore.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-musician-selector',
    imports: [MatMenuModule, MatButtonModule],
    templateUrl: './musician-selector.component.html',
    styleUrl: './musician-selector.component.scss'
})


export class MusicianSelectorComponent implements OnInit {

    @Output() musicianIdSelected = new EventEmitter<string>

    @Input() public musicianType: string
    musicians: Musician[];
    fs = inject(FirestoreService)

    ngOnInit(): void {
        const path = `musicians`
        this.fs.collection(path)
            .subscribe((musicians: Musician[]) => {
                musicians = musicians.sort((a: Musician, b: Musician) => a.name.localeCompare(b.name))
                this.musicians = musicians
            })
    }
    onMusicianIdSelected(musicianId: string) {
        this.musicianIdSelected.emit(musicianId)
    }
}
