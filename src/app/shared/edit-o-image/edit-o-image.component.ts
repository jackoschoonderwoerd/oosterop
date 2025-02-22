import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OImage } from '../models/o_image.model';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../services/snackbar.service';

interface OImageMetaDateFormValue {
    photographerName: string
}

@Component({
    selector: 'app-edit-o-image',
    imports: [ReactiveFormsModule, MatButtonModule, MatInput, MatFormFieldModule],
    templateUrl: './edit-o-image.component.html',
    styleUrl: './edit-o-image.component.scss'
})
export class EditOImageComponent implements OnInit {
    oImageMetaDatForm: FormGroup;
    fb = inject(FormBuilder)
    route = inject(ActivatedRoute)
    collectionName: string;
    documentId: string
    path: string;
    index: number;
    oImage: OImage;
    fs = inject(FirestoreService);
    router = inject(Router);
    sb = inject(SnackbarService)

    ngOnInit(): void {
        this.initForm()

        this.collectionName = this.route.snapshot.paramMap.get('collectionName');
        this.documentId = this.route.snapshot.paramMap.get('documentId');
        this.path = `${this.collectionName}/${this.documentId}`
        this.index = parseInt(this.route.snapshot.paramMap.get('index'))
        this.getOImages()
            .then((oImages: OImage[]) => {
                this.oImage = oImages[this.index]
                this.patchForm(this.oImage)
            })
        console.log(this.path, this.index);
    }

    initForm() {
        this.oImageMetaDatForm = this.fb.group({
            photographerName: new FormControl(null)
        })
    }

    getOImages() {
        console.log(this.path)
        return this.fs.getFieldInDocument(this.path, 'oImages')

    }
    patchForm(oImage: OImage) {
        this.oImageMetaDatForm.patchValue({
            photographerName: oImage.photographerName
        })
    }
    onUpdateOImage() {
        console.log(this.oImageMetaDatForm.value)
        const formValue: OImageMetaDateFormValue = this.oImageMetaDatForm.value;
        this.oImage.photographerName = formValue.photographerName;
        this.getOImages()
            .then((oImages: OImage[]) => {
                oImages[this.index].photographerName = formValue.photographerName;
                return oImages
            })
            .then((oImages: OImage[]) => {
                return this.fs.updateField(this.path, 'oImages', oImages)
            })
            .then((res: any) => {
                this.router.navigate(['band-images', { bandId: this.documentId }])
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }



    onCancel() {
        this.router.navigate(['band-images', { bandId: this.documentId }])
    }
}
