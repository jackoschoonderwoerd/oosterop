import { Component, inject, Input, OnInit } from '@angular/core';
import { Musician } from '../../../../shared/models/musician.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { FirestoreService } from '../../../../services/firestore.service';
import { take } from 'rxjs';
import { UiStore } from '../../../../services/ui.store';

@Component({
    selector: 'app-visitor-band-bandmembers',
    imports: [MatExpansionModule],
    templateUrl: './visitor-band-bandmembers.component.html',
    styleUrl: './visitor-band-bandmembers.component.scss'
})
export class VisitorBandBandmembersComponent {
    @Input() bandMemberIds: string[]
    bandMembers: Musician[];
    fs = inject(FirestoreService)
    uiStore = inject(UiStore)


}
