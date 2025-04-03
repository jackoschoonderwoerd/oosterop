import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../../../services/firestore.service';
import { Band } from '../../../../shared/models/band.model';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgClass } from '@angular/common';
import { UiService } from '../../../../services/ui.service';
import { NewsStore } from '../../../admin/news/news.store';
import { UiStore } from '../../../../services/ui.store';
import { last } from 'rxjs';

@Component({
    selector: 'app-news-bands-list',
    imports: [MatButtonModule, MatIconModule, NgClass, DatePipe],
    templateUrl: './news-bands-list.component.html',
    styleUrl: './news-bands-list.component.scss'
})
export class NewsBandsListComponent implements OnInit {

    fs = inject(FirestoreService)
    uiService = inject(UiService);

    newStore = inject(NewsStore)
    uiStore = inject(UiStore);
    bands: Band[];
    articles: Article[];
    listItems: any[];
    showBands: boolean = true;
    showArticles: boolean = false;

    selectedBandIndex: number = 0;
    selectedArticleIndex: number = 0;
    lastSelectedBandId: string;
    lastSelectedBandIndex: number;

    ngOnInit(): void {
        this.getBands();
        this.getArticles();

    }

    onShowBands() {
        // if (this.lastSelectedBandId) {
        //     this.onBand(this.lastSelectedBandId, this.lastSelectedBandIndex)
        // }
        this.selectedBandIndex = 0;
        this.showBands = true;
        this.showArticles = false;
        this.uiService.bandsVisible.emit(true);
        this.uiService.articlesVisible.emit(false);

    }
    // onShowNews() {

    //     this.showBands = false;
    //     this.showArticles = true;
    //     this.uiService.articlesVisible.emit(true);
    //     this.uiService.bandsVisible.emit(false);
    // }

    private getBands() {
        this.fs.collection(`bands`).subscribe((bands: Band[]) => {
            this.bands = bands
        })
    }
    private getArticles() {
        this.fs.sortedCollection(`articles`, 'date', 'desc').subscribe((articles: Article[]) => {
            this.articles = articles
        })
    }

    onBand(bandId: string, index: number) {
        console.log(index)
        this.selectedBandIndex = index;
        this.lastSelectedBandIndex = index;
        this.uiService.bandIdSelected.emit(bandId)
        this.uiStore.setShowNews(false)
        // this.bandSelected.emit()
        // this.router.navigate(['visitor-band', { bandId }])
    }

    onArticle(articleId: string, index: number) {
        this.selectedArticleIndex = index;
        this.uiService.articleIdSelected.emit(articleId)
        this.getArticle(articleId).subscribe((article: Article) => {
            this.uiStore.setArticle(article);
        })

    }
    private getArticle(articleId: string) {
        return this.fs.getDoc((`articles/${articleId}`))
    }
}
