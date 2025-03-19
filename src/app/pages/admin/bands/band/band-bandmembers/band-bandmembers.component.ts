import { Component } from '@angular/core';
import { BandmembersTableComponent } from './bandmembers-table/bandmembers-table.component';
import { BandmemberCheckboxComponent } from './bandmembers-table/bandmember-checkbox/bandmember-checkbox.component';
import { BandmembersListComponent } from './bandmembers-list/bandmembers-list.component';
import { AddMusicianComponent } from './add-musician/add-musician.component';

@Component({
    selector: 'app-band-bandmembers',
    imports: [
        BandmembersTableComponent,
        BandmembersListComponent,
        AddMusicianComponent
    ],
    templateUrl: './band-bandmembers.component.html',
    styleUrl: './band-bandmembers.component.scss'
})
export class BandBandmembersComponent {

}
