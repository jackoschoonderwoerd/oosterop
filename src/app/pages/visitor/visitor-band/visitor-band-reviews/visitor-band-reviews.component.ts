import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { Review } from '../../../../shared/models/review.model';
import { IconSubmenuComponent } from '../../../../shared/icon-submenu/icon-submenu.component';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { VisibilityEyesComponent } from '../../../../shared/visibility-eyes/visibility-eyes.component';
import { AuthStore } from '../../../../auth/auth.store';
import { UiStore } from '../../../../services/ui.store';

@Component({
    selector: 'app-visitor-band-reviews',
    imports: [

        MatExpansionModule,
        DatePipe,
        VisibilityEyesComponent
    ],
    templateUrl: './visitor-band-reviews.component.html',
    styleUrl: './visitor-band-reviews.component.scss'
})
export class VisitorBandReviewsComponent implements OnInit {
    @Input() public reviews: Review[]
    route = inject(ActivatedRoute)
    bandId: string;
    fs = inject(FirestoreService);
    authStore = inject(AuthStore);
    uiStore = inject(UiStore);
    // reviews: Review[]

    ngOnInit(): void {
        // console.log(this.reviews)
        // this.bandId = this.route.snapshot.paramMap.get('bandId')
        // this.fs.getFieldInDocument(`bands/${this.bandId}`, 'reviews')
        //     .then((reviews: Review[]) => {
        //         this.reviews = reviews
        //     })
    }
}
