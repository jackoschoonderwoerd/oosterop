import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { NewsService } from '../news.service';
import { Article } from '../../../../shared/models/article-models/ariticle.model';

import { FirestoreService } from '../../../../services/firestore.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { FirestoreDateObject } from '../../../../shared/models/firestore-date-object';

@Component({
    selector: 'app-news-date',
    imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInput,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule
    ],
    templateUrl: './news-date.component.html',
    styleUrl: './news-date.component.scss'
})
export class NewsDateComponent implements OnInit {
    @Input() header: string;
    newsService = inject(NewsService);
    form: FormGroup;
    fb = inject(FormBuilder)
    article: Article;
    fs = inject(FirestoreService);
    sb = inject(SnackbarService)

    ngOnInit(): void {
        this.initForm()
        this.newsService.articleChanged.subscribe((article: Article) => {
            this.article = article
            // // console.log(this.article)
            if (this.article && this.article.date) {
                this.patchForm(article.date)
            }
        })
    }
    initForm() {
        this.form = this.fb.group({
            date: new FormControl(new Date, [Validators.required])
        })
    }

    onDateChange(event: MatDatepickerInputEvent<Date>) {
        // console.log(event.value)
        const date: Date = event.value
        // return;
        // // console.log(this.form.value.date)
        // const date = this.form.value.date
        this.fs.updateField(`articles/${this.article.id}`, 'date', date)
            .then((res: any) => {
                this.sb.openSnackbar(`date updated`)
            })
            .catch((err: | FirebaseError) => {
                // console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    private patchForm(date: Date | any) {
        this.form.setValue({
            date: new Date(date.seconds * 1000)
        })
    }
    // onDateChange(event: MatDatepickerInputEvent<Date>) {
    //     // console.log(event.value)
    // }
}
