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
import { NewsStore } from '../news.store';
import { JsonPipe } from '@angular/common';
import { ConfirmService } from '../../../../shared/confirm/confirm.service';

@Component({
    selector: 'app-news-images',
    imports: [
        AddImageComponent,
        ReactiveFormsModule,
        MatInput,
        MatButtonModule,
        MatFormFieldModule,

    ],
    templateUrl: './news-images.component.html',
    styleUrl: './news-images.component.scss'
})
export class NewsImagesComponent implements OnInit {
    @Input() header: string
    @Input() oImage: OImage
    article: Article
    fs = inject(FirestoreService)
    sb = inject(SnackbarService)
    newsService = inject(NewsService)
    imagePath: string;
    filename: string;
    form: FormGroup
    fb = inject(FormBuilder);
    storage = inject(StorageService)
    newsStore = inject(NewsStore)
    pathToFolder: string;
    confirmService = inject(ConfirmService)


    ngOnInit(): void {
        this.initForm()
        this.newsService.articleChanged.subscribe((article: Article) => {
            if (article) {
                this.article = article;
                this.pathToFolder = `news/${article.id}`
                console.log(article);
                this.patchForm(article)
            }
            if (article && article.oImage) {
                this.imagePath = article.oImage.imagePath
            }
        })
    }

    patchForm(article) {
        if (article.oImage && article.oImage.photographerName) {
            this.form.patchValue({
                photographerName: article.oImage.photographerName
            })
        }
    }

    filePathChanged(imageData: any) {
        const oImage: OImage = {
            imagePath: imageData.filePath,
            filename: imageData.filename
        }
        console.log(oImage)

        this.onSubmitImage(oImage)
    }

    initForm() {
        this.form = this.fb.group({
            photographerName: new FormControl(null, [Validators.required])
        })
    }

    onSubmitImage(oImage: OImage) {
        console.log(oImage)
        this.fs.updateField(`articles/${this.article.id}`, 'oImage', oImage)
            .then((res: any) => {
                this.form.reset();
                this.sb.openSnackbar(`oImage updated`)
                this.newsService.getArticle(this.article.id)
            })
            .catch((err: FirebaseError) => {
                // console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    onUpdatePhotographerName() {
        const photographerName = this.form.value.photographerName;
        const oImage: OImage = {
            ...this.article.oImage,
            photographerName
        }
        this.fs.updateField(`articles/${this.article.id}`, 'oImage', oImage)
            .then((res: any) => {
                this.sb.openSnackbar(`photographer name updated`)
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    onRemoveImage(filename: string) {
        this.confirmService.getConfirmation(filename)
            .then((confirmation: boolean) => {
                if (confirmation) {
                    this.removeFromStorage()
                        .then((res: any) => {
                            this.sb.openSnackbar(`imagefile removed from storage`)
                            this.imagePath = null;
                            return this.removeFromFirestore()
                        })
                        .then(() => {

                        })
                        .catch((err: FirebaseError) => {
                            // console.log(err);
                            this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                        })

                } else {
                    this.sb.openSnackbar(`operation aborted by user`)
                }
            })
    }

    private removeFromStorage() {
        const path = `news/${this.article.id}/${this.article.oImage.filename}`
        return this.storage.deleteFile(path)
    }

    private removeFromFirestore() {
        // console.log('removing from firestore')
        return this.fs.updateField(`articles/${this.article.id}`, 'oImage', null)
    }
}
