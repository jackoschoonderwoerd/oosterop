import { Component, inject, OnInit } from '@angular/core';
import { IconSubmenuComponent } from '../../../../shared/icon-submenu/icon-submenu.component';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { Concert } from '../../../../shared/models/concert.model';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-visitor-band-concerts',
    imports: [
        IconSubmenuComponent,
        DatePipe,
        MatIconModule,
        MatButtonModule,
        DatePipe
    ],
    templateUrl: './visitor-band-concerts.component.html',
    styleUrl: './visitor-band-concerts.component.scss'
})
export class VisitorBandConcertsComponent implements OnInit {
    route = inject(ActivatedRoute)
    fs = inject(FirestoreService)
    concerts: Concert[] = []



    ngOnInit(): void {
        const bandId = this.route.snapshot.paramMap.get('bandId')
        this.getConcerts(bandId)
    }
    getConcerts(bandId: string) {
        this.fs.getFieldInDocument(`bands/${bandId}`, 'concerts')
            .then((concerts: Concert[]) => {
                this.concerts = concerts
            })

    }


}
