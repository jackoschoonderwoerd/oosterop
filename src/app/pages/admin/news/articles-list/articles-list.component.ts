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

@Component({
    selector: 'app-articles-list',
    imports: [
        DatePipe,
        MatIconModule
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
    ConfirmService = inject(ConfirmService)


    ngOnInit(): void {
        this.fs.collection(`articles`)
            .subscribe((articles: Article[]) => {
                if (articles) {
                    this.articles = articles
                }
            })
    }
    onEdit(articleId: string) {
        // console.log(articleId)
        this.fs.getDoc(`articles/${articleId}`)
            .subscribe((article: Article) => {
                this.newsStore.setArticle(article);
                this.newsService.articleActivated.next(article)
            })
    }

    onDelete(articleId: string, articleTitle: string) {
        this.ConfirmService.getConfirmation(articleTitle)
            .then((res: boolean) => {
                if (res) {
                    this.fs.deleteDoc(`articles/${articleId}`)
                        .then((res: any) => {
                            this.sb.openSnackbar(`article deleted`)
                        })
                        .catch((err: FirebaseError) => {
                            console.log(err)
                            this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                        })
                }
            })
        // console.log(articleId)
        // const dialogRef = this.dialog.open(ConfirmComponent, {
        //     data: {
        //         doomedElement: articleId
        //     }
        // })
        // dialogRef.afterClosed().subscribe((res: boolean) => {
        //     if (res) {
        //     }
        // })
    }
}
