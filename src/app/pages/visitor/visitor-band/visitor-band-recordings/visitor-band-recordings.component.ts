import { Component, Input } from '@angular/core';
import { Recording } from '../../../../shared/models/recording.model';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-visitor-band-recordings',
    imports: [MatExpansionModule],
    templateUrl: './visitor-band-recordings.component.html',
    styleUrl: './visitor-band-recordings.component.scss'
})
export class VisitorBandRecordingsComponent {
    @Input() public recordings: Recording[];
}
