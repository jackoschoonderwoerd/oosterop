import { Component, inject, Input, OnInit } from '@angular/core';
import { QuillTextEditorComponent } from '../../../../shared/quill-text-editor/quill-text-editor.component';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../../../services/firestore.service';
import { NewsService } from '../news.service';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { TextEditorService } from '../../../../services/text-editor.service';

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

    ngOnInit(): void {
        this.newsService.articleActivated.subscribe((article: Article) => {
            if (article) {
                this.article = article;
                // console.log(article)
                if (this.article.body) {

                    this.textEditorService.passBodyToEditor(article.body)
                } else {

                    this.textEditorService.passBodyToEditor('')
                }
            }
        })
    }


    htmlChanged(e: any) {
        this.body = e;
        // console.log(this.body)
    }
    onSubmitText() {
        this.fs.updateField(`articles/${this.article.id}`, 'body', this.body)
            .then((res: any) => {
                this.sb.openSnackbar(`body updated`)
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
}
