import { Component, inject, Input, OnInit } from '@angular/core';
import { QuillTextEditorComponent } from '../../../../shared/quill-text-editor/quill-text-editor.component';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../../../services/firestore.service';
import { NewsService } from '../news.service';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { TextEditorService } from '../../../../services/text-editor.service';
import { NewsStore } from '../news.store';

@Component({
    selector: 'app-news-body',
    imports: [
        QuillTextEditorComponent,
        MatButtonModule
    ],
    templateUrl: './news-body.component.html',
    styleUrl: './news-body.component.scss'
})
export class NewsBodyComponent implements OnInit {
    @Input() header: string
    body: string = 'bala';
    fs = inject(FirestoreService);
    newsService = inject(NewsService);
    article: Article;
    sb = inject(SnackbarService)
    textEditorService = inject(TextEditorService)
    newsStore = inject(NewsStore)

    ngOnInit(): void {
        this.newsService.articleChanged.subscribe((article: Article) => {
            if (article) {
                this.article = article;
                if (this.article.body) {
                    setTimeout(() => {
                        this.textEditorService.passBodyToEditor(article.body)
                    }, 500);
                } else {

                    this.textEditorService.passBodyToEditor('')
                }
            }
        })
    }


    htmlChanged(html: string) {
        this.body = html;
        console.log(this.body)
    }
    onSubmitText() {
        this.fs.updateField(`articles/${this.article.id}`, 'body', this.body)
            .then((res: any) => {
                this.sb.openSnackbar(`body updated`)
            })
            .catch((err: FirebaseError) => {
                // console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
}
