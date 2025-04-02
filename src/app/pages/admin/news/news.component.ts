import { Component, inject, OnInit } from '@angular/core';
import { NewsBandmembersComponent } from './news-bandmembers/news-bandmembers.component';
import { NewsBodyComponent } from './news-body/news-body.component';
import { NewsPrimaryComponent } from './news-primary/news-primary.component';
import { NewsImagesComponent } from './news-images/news-images.component';
import { NewsLinksComponent } from './news-links/news-links.component';
import { NewsQuotesComponent } from './news-quotes/news-quotes.component';
import { NewsTourPeriodsComponent } from './news-tour-periods/news-tour-periods.component';
import { NewsDateComponent } from './news-date/news-date.component';
import { NewsStore } from './news.store';
import { Article } from '../../../shared/models/article-models/ariticle.model';
import { FirestoreService } from '../../../services/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewsService } from './news.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { NewsVisibleComponent } from './news-visible/news-visible.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { SnackbarService } from '../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { ArticlesListComponent } from './articles-list/articles-list.component';

@Component({
    selector: 'app-news',
    imports: [
        NewsBandmembersComponent,
        NewsBodyComponent,
        NewsPrimaryComponent,
        NewsImagesComponent,
        NewsLinksComponent,
        NewsQuotesComponent,
        NewsTourPeriodsComponent,
        NewsVisibleComponent,
        NewsDateComponent,
        MatIconModule,
        ArticlesListComponent,
        MatButtonModule,
        JsonPipe,
        DatePipe
    ],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {

    newsStore = inject(NewsStore);
    newsService = inject(NewsService)
    activeNewsAricleId: string;
    articles: Article[]
    fs = inject(FirestoreService);
    dialog = inject(MatDialog);
    sb = inject(SnackbarService)

    ngOnInit(): void {
        this.fs.collection(`articles`)
            .subscribe((articles: Article[]) => {
                this.articles = articles
            })
    }
    // onEdit(articleId: string) {
    //     // console.log(articleId)
    //     this.fs.getDoc(`articles/${articleId}`)
    //         .subscribe((article: Article) => {
    //             this.newsStore.setArticle(article);
    //             this.newsService.articleActivated.next(article)
    //         })
    // }

    // onDelete(articleId: string) {
    //     console.log(articleId)
    //     const dialogRef = this.dialog.open(ConfirmComponent, {
    //         data: {
    //             doomedElement: articleId
    //         }
    //     })
    //     dialogRef.afterClosed().subscribe((res: boolean) => {
    //         if (res) {
    //             this.fs.deleteDoc(`articles/${articleId}`)
    //                 .then((res: any) => {
    //                     this.sb.openSnackbar(`article deleted`)
    //                 })
    //                 .catch((err: FirebaseError) => {
    //                     console.log(err)
    //                     this.sb.openSnackbar(`operation failed due to: ${err.message}`)
    //                 })
    //         }
    //     })
    // }

    onClearForms() {
        console.log('onClearForm()')
        this.newsStore.setArticle(null);
        this.newsService.activateArticle(null)
    }
}
