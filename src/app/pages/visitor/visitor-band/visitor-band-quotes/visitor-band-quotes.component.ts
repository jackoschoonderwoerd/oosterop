t: import { Component, inject, Input } from '@angular/core';
import { Review } from '../../../../shared/models/review.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { UiStore } from '../../../../services/ui.store';
import { AuthStore } from '../../../../auth/auth.store';
import { VisibilityEyesComponent } from '../../../../shared/visibility-eyes/visibility-eyes.component';

@Component({
    selector: 'app-visitor-band-quotes',
    imports: [MatExpansionModule, VisibilityEyesComponent],
    templateUrl: './visitor-band-quotes.component.html',
    styleUrl: './visitor-band-quotes.component.scss'
})
export class VisitorBandQuotesComponent {
    @Input() public quotes: Review[]
    uiStore = inject(UiStore);
    authStore = inject(AuthStore)
}
