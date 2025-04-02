import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { NewsService } from '../news.service';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { last, take } from 'rxjs';

@Component({
    selector: 'app-news-visible',
    imports: [
        ReactiveFormsModule,
        MatCheckboxModule,
        MatButtonModule
    ],
    templateUrl: './news-visible.component.html',
    styleUrl: './news-visible.component.scss'
})
export class NewsVisibleComponent implements OnInit {
    @Input() header
    form: FormGroup
    fb = inject(FormBuilder)
    editmode: boolean = false;
    newsService = inject(NewsService)
    article: Article;
    fs = inject(FirestoreService);
    sb = inject(SnackbarService)

    ngOnInit(): void {
        this.initForm();
        this.newsService.articleActivated.subscribe((article: Article) => {
            // console.log(article)
            this.article = article
            if (this.article && this.article.visible != undefined) {
                this.patchForm(this.article.visible)
            }
        })
    }

    initForm() {
        this.form = this.fb.group({
            visible: new FormControl(null, [Validators.required])
        })
    }
    patchForm(articleVisible: boolean) {
        // console.log(articleVisible)
        this.form.setValue({
            visible: articleVisible
        })
    }
    onCheckboxChange(event: MatCheckboxChange) {
        // console.log(event.checked)
        this.fs.updateField(`articles/${this.article.id}`, 'visible', event.checked)
            .then((res: any) => {
                this.sb.openSnackbar(`visibility updated`)
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })


    }

    updateVisibility() {

    }
}
