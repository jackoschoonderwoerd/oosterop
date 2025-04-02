import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { ArticlePrimary } from '../../../../shared/models/article-models/article-primary.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { NewsService } from '../news.service';
import { NewsStore } from '../news.store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JsonPipe } from '@angular/common';
import { Subscription, take } from 'rxjs';

@Component({
    selector: 'app-news-primary',
    imports: [
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatFormFieldModule,
        MatInput,
        ReactiveFormsModule,
        MatCheckboxModule,


    ],
    templateUrl: './news-primary.component.html',
    styleUrl: './news-primary.component.scss'
})
export class NewsPrimaryComponent implements OnInit {
    @Input() header;

    form: FormGroup;
    fb = inject(FormBuilder);
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    newsService = inject(NewsService);
    newsStore = inject(NewsStore);
    editmode: boolean = false;
    articleId: string;
    @Output() resetForm = new EventEmitter<void>();
    subscription: Subscription





    ngOnInit(): void {
        this.initForm();
        this.newsService.articleActivated.subscribe((article: Article) => {
            // console.log(article)
            if (article) {
                this.articleId = article.id;
                this.editmode = true;
                this.setForm(article)
            } else {
                this.form.reset();
                this.editmode = false;
            }
        })
    }

    initForm() {
        this.form = this.fb.group({
            header: new FormControl(null, [Validators.required]),
            // visible: new FormControl(true, [Validators.required])
        })
    }
    setForm(article: Article) {
        this.form.patchValue({
            header: article.header,
        })
    }

    onSaveOrUpdatePrimary() {
        const header: string = (this.form.value.header.trim().toLowerCase());



        const article: Article = {
            header: header,
            visible: true,
            date: new Date()
        }
        if (!this.editmode) {
            this.addPrimary(article)
        }
        else {
            this.updateHeader(header)
        }
    }

    addPrimary(article: Article) {
        this.fs.addDoc(`articles`, article)
            .then((docRef: DocumentReference) => {
                // console.log(docRef.id)
                const articleId = docRef.id
                this.articleId = docRef.id
                this.sb.openSnackbar(`article added`)
                return articleId
            })
            .then((articleId: string) => {
                const promise = new Promise((resolve, reject) => {

                    this.fs.getDoc(`articles/${articleId}`)
                        .subscribe((article: Article) => {
                            resolve(article)
                        })
                })
                return promise
            })
            .then((article: Article) => {
                console.log(article)
                this.newsStore.setArticle(article)
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    updateHeader(header: string) {
        this.fs.updateField(`articles/${this.articleId}`, 'header', header)
            .then((res: any) => {
                this.sb.openSnackbar(`header updated`)
                // this.resetPrimaryForm();
                // this.editmode = false;
                setTimeout(() => {
                    // this.resetForm.emit();
                }, 1000);
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    private resetPrimaryForm() {
        console.log('resetPrimaryForm()');
        setTimeout(() => {
            this.form.reset()
        }, 1000);
    }
}
