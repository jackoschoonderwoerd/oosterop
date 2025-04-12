import { Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../../../services/firestore.service';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NewsStore } from '../news.store';
import { NewsService } from '../news.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { ConfirmService } from '../../../../shared/confirm/confirm.service';
import { FirebaseError } from '@angular/fire/app';
import { MatButtonModule } from '@angular/material/button';
import { OImage } from '../../../../shared/models/o_image.model';
import { WarningService } from '../../../../shared/warning/warning.service';

@Component({
    selector: 'app-articles-list',
    imports: [
        DatePipe,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './articles-list.component.html',
    styleUrl: './articles-list.component.scss'
})
export class ArticlesListComponent implements OnInit {
    fs = inject(FirestoreService)
    articles: Article[];
    newsStore = inject(NewsStore)
    newsService = inject(NewsService);
    sb = inject(SnackbarService)
    confirmService = inject(ConfirmService)
    warningService = inject(WarningService)


    ngOnInit(): void {
        this.fs.collection(`articles`)
            .subscribe((articles: Article[]) => {
                if (articles) {
                    this.articles = articles
                }
            })
    }
    onEdit(articleId: string) {
        this.newsService.getArticle(articleId)
        // this.fs.getDoc(`articles/${articleId}`)
        //     .subscribe((article: Article) => {
        //         this.newsStore.setArticle(article);
        //         this.newsService.articleChanged.next(article)
        //     })
    }

    onDelete(articleId: string, articleTitle: string, oImage: OImage) {
        if (oImage) {
            this.warningService.showWarning('remove image before removing news item')

        } else {
            console.log('proceed')
            this.confirmService.getConfirmation(articleTitle)
                .then((res: boolean) => {
                    if (res) {
                        this.fs.deleteDoc(`articles/${articleId}`)
                            .then((res: any) => {
                                this.sb.openSnackbar(`article deleted`)
                            })
                            .catch((err: FirebaseError) => {
                                // console.log(err)
                                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                            })
                    }
                })
        }
    }
    onAddNewArticle() {
        this.newsService.articleChanged.emit(null);
    }
}
