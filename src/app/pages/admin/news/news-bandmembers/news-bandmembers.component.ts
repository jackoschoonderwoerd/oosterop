import { Component, inject, Input, OnInit } from '@angular/core';
import { Band } from '../../../../shared/models/band.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { MatMenuModule } from '@angular/material/menu';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { NewsService } from '../news.service';
import { Musician } from '../../../../shared/models/musician.model';
import { Bandmember } from '../../../../shared/models/bandmemmber.model';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { BandmembersService } from '../../bands/band/band-bandmembers/bandmembers.service';

@Component({
    selector: 'app-news-bandmembers',
    imports: [
        MatMenuModule,
        MatButtonModule
    ],
    templateUrl: './news-bandmembers.component.html',
    styleUrl: './news-bandmembers.component.scss'
})
export class NewsBandmembersComponent implements OnInit {
    @Input() header: string;
    bands: Band[];
    article: Article;
    fs = inject(FirestoreService)
    bandmemberIds: string[] = [];
    newsService = inject(NewsService)
    sb = inject(SnackbarService);
    bmService = inject(BandmembersService)

    ngOnInit(): void {
        this.newsService.articleActivated.subscribe((article: Article) => {
            this.article = article
        })
        this.fs.collection('bands')
            .subscribe((bands: Band[]) => {
                // console.log(bands)
                this.bands = bands
            })
    }
    onBandSelected(bandId: string) {
        console.log(bandId)
        // return;
        this.fs.getFieldInDocument(`bands/${bandId}`, 'bandMemberIds')
            .then((bandmemberIds: string[]) => {
                console.log(bandmemberIds);
                this.bmService.getBandMembers(bandmemberIds)
                    .then((bandmembers: any[]) => {
                        console.log(bandmembers)
                        this.fs.updateField(`articles/${this.article.id}`, 'bandmembers', bandmembers)
                    })
                return;
                bandmemberIds.forEach((bandmemberId: string) => {
                    this.fs.getDoc(`musicians/${bandmemberId}`)
                        .subscribe((bandmember: Bandmember) => {
                            console.log(bandmember)
                            this.fs.addElementToArray(`articles/${this.article.id}`, 'bandmembers', bandmember)
                                .then((res: any) => {
                                    this.sb.openSnackbar(`bandmember added to article`)
                                })
                                .catch((err: FirebaseError) => {
                                    console.log(err);
                                    this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                                })

                        })
                })
            })
    }
    // getBandmembers(bandmemberIds) {
    //     this.bmService.getBandMembers(bandmemberIds)
    //         .then((data: any) => console.log(data))
    // }
}
