import { Component, inject, OnInit } from '@angular/core';
import { NewsStore } from '../../admin/news/news.store';
import { DatePipe, JsonPipe } from '@angular/common';
import { Article } from '../../../shared/models/article-models/ariticle.model';
import { NewsService } from '../../admin/news/news.service';
import { UiService } from '../../../services/ui.service';
import { FirestoreService } from '../../../services/firestore.service';
import { UiStore } from '../../../services/ui.store';

@Component({
    selector: 'app-visitor-news',
    imports: [DatePipe, JsonPipe],
    templateUrl: './visitor-news.component.html',
    styleUrl: './visitor-news.component.scss'
})
export class VisitorNewsComponent implements OnInit {
    newsStore = inject(NewsStore)
    newsService = inject(NewsService)
    article: Article;
    uiService = inject(UiService);
    fs = inject(FirestoreService);
    uiStore = inject(UiStore)

    ngOnInit(): void {
        // this.uiService.articleIdSelected.subscribe((articleId: string) => {
        //     this.getArticle(articleId)
        // })
    }
    // getArticle(articleId) {
    //     const path = `articles/${articleId}`
    //     this.fs.getDoc(path)
    //         .subscribe((article: Article) => {
    //             if (article) {
    //                 this.article = article
    //                 this.uiStore.setArticle(article)
    //             }
    //         })
    // }

}
