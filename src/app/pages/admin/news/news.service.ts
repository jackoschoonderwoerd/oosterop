import { EventEmitter, Injectable } from '@angular/core';
import { Article } from '../../../shared/models/article-models/ariticle.model';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    constructor() { }

    articleActivated = new EventEmitter<Article>();

    activateArticle(article: Article) {
        if (article) {
            this.articleActivated.emit(article)
        } else {
            this.articleActivated.emit(null)
        }
    }

}
