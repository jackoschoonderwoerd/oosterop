import { Component, inject, Input, OnInit } from '@angular/core';
import { AddLinkComponent } from '../../../../shared/add-link/add-link.component';
import { Link } from '../../../../shared/models/link.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { NewsService } from '../news.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmService } from '../../../../shared/confirm/confirm.service';

@Component({
    selector: 'app-news-links',
    imports: [AddLinkComponent, MatIconModule],
    templateUrl: './news-links.component.html',
    styleUrl: './news-links.component.scss'
})
export class NewsLinksComponent implements OnInit {
    @Input() header: string;
    fs = inject(FirestoreService)
    article: Article;
    newsService = inject(NewsService);
    sb = inject(SnackbarService);
    confirmService = inject(ConfirmService)


    ngOnInit(): void {
        this.newsService.articleActivated.subscribe((article: Article) => {
            this.article = article
        })
    }

    linkReady(link: Link) {
        console.log(link)
        // return;
        this.fs.addElementToArray(`articles/${this.article.id}`, 'links', link)
            .then((res: any) => {
                this.sb.openSnackbar(`link added`)
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    onDelete(link: Link) {
        console.log(link)
        this.confirmService.getConfirmation(link.title)
            .then((res: boolean) => {
                if (res) {
                    this.fs.removeElementFromArray(`articles/${this.article.id}`, 'links', link)
                        .then((res: any) => {
                            this.sb.openSnackbar(`link removed`)
                        })
                        .catch((err: FirebaseError) => {
                            console.log(err);
                            this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                        })
                } else {
                    this.sb.openSnackbar(`operation aborted by user`);
                }
            })
    }

}
