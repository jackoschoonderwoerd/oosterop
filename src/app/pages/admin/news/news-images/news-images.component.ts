import { Component, inject, Input, OnInit } from '@angular/core';
import { AddImageComponent } from '../../../../shared/add-image/add-image.component';
import { Article } from '../../../../shared/models/article-models/ariticle.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { NewsService } from '../news.service';
import { FirebaseError } from '@angular/fire/app';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OImage } from '../../../../shared/models/o_image.model';
import { StorageService } from '../../../../services/storage.service';

@Component({
    selector: 'app-news-images',
    imports: [
        AddImageComponent,
        ReactiveFormsModule,
        MatInput,
        MatButtonModule,
        MatFormFieldModule
    ],
    templateUrl: './news-images.component.html',
    styleUrl: './news-images.component.scss'
})
export class NewsImagesComponent implements OnInit {
    @Input() header: string
    article: Article
    fs = inject(FirestoreService)
    sb = inject(SnackbarService)
    newsService = inject(NewsService)
    imagePath: string;
    filename: string;
    form: FormGroup
    fb = inject(FormBuilder);
    storage = inject(StorageService)


    ngOnInit(): void {
        this.initForm()
        this.newsService.articleActivated.subscribe((article: Article) => {
            if (article) {
                this.article = article;
            }
            if (article && article.oImage) {
                this.imagePath = article.oImage.imagePath
            }
        })
    }

    filePathChanged(e) {
        console.log(e)
        this.imagePath = e.filePath;
        this.filename = e.filename;
    }

    initForm() {
        this.form = this.fb.group({
            photographerName: new FormControl(null, [Validators.required])
        })
    }
    onSubmitImage() {
        const oImage: OImage = {
            imagePath: this.imagePath,
            photographerName: this.form.value.photographerName,
            filename: this.filename
        }
        this.fs.updateField(`articles/${this.article.id}`, 'oImage', oImage)
            .then((res: any) => {
                this.form.reset();
                this.sb.openSnackbar(`oImage updated`)
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    onRemoveImage() {
        console.log(this.article.oImage)

        // return;
        this.removeFromStorage()
            .then((res: any) => {
                this.sb.openSnackbar(`imagefile removed from storage`)
                this.imagePath = null;
                return this.removeFromFirestore()
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
        // .then((res: any) => {
        //     this.sb.openSnackbar(`oImage removed from firestore`)
        // })
        // .catch((err: FirebaseError) => {
        //     console.log(err);
        //     this.sb.openSnackbar(`operation failed due to: ${err.message}`)
        // })
    }

    removeFromStorage() {
        const path = `news/${this.article.oImage.filename}`
        return this.storage.deleteFile(path)
    }

    removeFromFirestore() {
        console.log('removing from firestore')
        return this.fs.updateField(`articles/${this.article.id}`, 'oImage', null)
    }
}
