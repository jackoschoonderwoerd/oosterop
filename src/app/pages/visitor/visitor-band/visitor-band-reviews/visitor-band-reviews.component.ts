import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { Review } from '../../../../shared/models/review.model';
import { IconSubmenuComponent } from '../../../../shared/icon-submenu/icon-submenu.component';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-visitor-band-reviews',
    imports: [IconSubmenuComponent, JsonPipe, MatExpansionModule, DatePipe],
    templateUrl: './visitor-band-reviews.component.html',
    styleUrl: './visitor-band-reviews.component.scss'
})
export class VisitorBandReviewsComponent implements OnInit {
    route = inject(ActivatedRoute)
    bandId: string;
    fs = inject(FirestoreService)
    reviews: Review[]

    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        this.fs.getFieldInDocument(`bands/${this.bandId}`, 'reviews')
            .then((reviews: Review[]) => {
                this.reviews = reviews
            })
    }
}
