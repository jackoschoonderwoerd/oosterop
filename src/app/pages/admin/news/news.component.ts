import { Article } from '../../../shared/models/article-models/ariticle.model';
import { Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewsBodyComponent } from './news-body/news-body.component';
import { NewsDateComponent } from './news-date/news-date.component';
import { NewsImagesComponent } from './news-images/news-images.component';
import { NewsPrimaryComponent } from './news-primary/news-primary.component';
import { NewsService } from './news.service';
import { NewsStore } from './news.store';
import { NewsVisibleComponent } from './news-visible/news-visible.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';





@Component({
    selector: 'app-news',
    imports: [
        ArticlesListComponent,
        MatButtonModule,
        MatIconModule,
        NewsBodyComponent,
        NewsDateComponent,
        NewsImagesComponent,
        NewsPrimaryComponent,
        NewsVisibleComponent,
    ],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {

    newsStore = inject(NewsStore);
    newsService = inject(NewsService)

    articles: Article[]
    fs = inject(FirestoreService);



    ngOnInit(): void {
        this.fs.collection(`articles`)
            .subscribe((articles: Article[]) => {
                this.articles = articles
            })
    }


    onClearForms() {
        console.log('onClearForm()')
        this.newsStore.setArticle(null);
        this.newsService.activateArticle(null)
    }
}
