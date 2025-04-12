import { EventEmitter, inject, Injectable } from '@angular/core';
import { Article } from '../../../shared/models/article-models/ariticle.model';
import { FirestoreService } from '../../../services/firestore.service';
import { getDoc } from '@angular/fire/firestore';
import { NewsStore } from './news.store';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    fs = inject(FirestoreService)
    newsStore = inject(NewsStore);
    article: Article

    constructor() { }

    articleChanged = new EventEmitter<Article | null>();


    activateArticle(article: Article) {
        if (article) {
            this.articleChanged.emit(article)
        } else {
            this.articleChanged.emit(null)
        }
    }

    getArticle(articleId) {
        this.fs.getDoc(`articles/${articleId}`)
            .subscribe((article: Article) => {
                if (article) {
                    this.articleChanged.emit(article)

                } else {
                    this.articleChanged.emit(null)
                }
            })
    }



}
