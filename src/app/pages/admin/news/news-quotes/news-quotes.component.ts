import { Component, inject, Input, OnInit } from '@angular/core';
import { QuillTextEditorComponent } from '../../../../shared/quill-text-editor/quill-text-editor.component';
import { FirestoreService } from '../../../../services/firestore.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { NewsService } from '../news.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Review } from '../../../../shared/models/review.model';
import { FirebaseError } from '@angular/fire/app';

@Component({
    selector: 'app-news-quotes',
    imports: [
        QuillTextEditorComponent,
        MatInput,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './news-quotes.component.html',
    styleUrl: './news-quotes.component.scss'
})
export class NewsQuotesComponent implements OnInit {
    @Input() header: string
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    fb = inject(FormBuilder)
    article: Article;
    newsService = inject(NewsService)
    html: string = 'bla'
    form: FormGroup

    ngOnInit(): void {
        this.initForm()
        this.newsService.articleActivated.subscribe((article: Article) => {
            this.article = article
        })

    }
    initForm() {
        this.form = this.fb.group({
            publisher: new FormControl('jazz nu'),
            author: new FormControl('jacko'),
            datePublished: new FormControl(new Date())
        })
    }

    htmlChanged(html: string) {
        console.log(html);
        this.html = html
    }

    onSubmit() {
        const formValue = this.form.value
        const quote: Review = {
            body: this.html,
            visible: true,
            publishedBy: formValue.publisher,
            author: formValue.author,
            type: 'quote'
        }
        console.log(quote)
        this.fs.addElementToArray(`articles/${this.article.id}`, 'quotes', quote)
            .then((res: any) => {
                this.sb.openSnackbar(`quote added`);
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
}
