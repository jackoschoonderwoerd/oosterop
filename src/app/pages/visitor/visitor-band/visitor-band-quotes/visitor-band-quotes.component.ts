import { Component, Input } from '@angular/core';
import { Review } from '../../../../shared/models/review.model';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-visitor-band-quotes',
    imports: [MatExpansionModule],
    templateUrl: './visitor-band-quotes.component.html',
    styleUrl: './visitor-band-quotes.component.scss'
})
export class VisitorBandQuotesComponent {
    @Input() public quotes: Review[]
}
