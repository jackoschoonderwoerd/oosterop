import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../../../services/firestore.service';
import { Band } from '../../../../shared/models/band.model';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { UiService } from '../../../../services/ui.service';
import { NewsStore } from '../../../admin/news/news.store';
import { UiStore } from '../../../../services/ui.store';



@Component({
    selector: 'app-bands-list',
    imports: [MatButtonModule, MatIconModule, NgClass],
    templateUrl: './bands-list.component.html',
    styleUrl: './bands-list.component.scss'
})
export class BandsListComponent implements OnInit {

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

        this.selectedBandIndex = 0;
        this.showBands = true;
        this.showArticles = false;
        this.uiService.bandsVisible.emit(true);
        this.uiService.articlesVisible.emit(false);
    }


    private getBands() {
        this.fs.sortedCollection(`bands`, 'seqNr', 'asc').subscribe((bands: Band[]) => {
            this.bands = bands
        })
    }
    private getArticles() {
        this.fs.sortedCollection(`articles`, 'date', 'desc').subscribe((articles: Article[]) => {
            this.articles = articles
        })
    }

    onBand(bandId: string, index: number) {
        console.log(bandId, index)
        this.selectedBandIndex = index;

        // this.lastSelectedBandIndex = index;
        setTimeout(() => {
            this.uiService.bandIdSelected.emit(bandId)
        }, 0);
        this.uiStore.setHomeSelected(false)
        this.uiService.scrollToTopContent.emit()
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
