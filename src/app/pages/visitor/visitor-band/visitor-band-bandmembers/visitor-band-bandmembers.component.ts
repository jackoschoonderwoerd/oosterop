import { Component, Input } from '@angular/core';
import { Musician } from '../../../../shared/models/musician.model';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-visitor-band-bandmembers',
    imports: [MatExpansionModule],
    templateUrl: './visitor-band-bandmembers.component.html',
    styleUrl: './visitor-band-bandmembers.component.scss'
})
export class VisitorBandBandmembersComponent {
    @Input() bandMembers: Musician[]
}
