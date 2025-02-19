import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OImage } from '../models/o_image.model';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-edit-o-image',
    imports: [ReactiveFormsModule, MatButtonModule, MatInput, MatFormFieldModule],
    templateUrl: './edit-o-image.component.html',
    styleUrl: './edit-o-image.component.scss'
})
export class EditOImageComponent implements OnInit {
    oImageForm: FormGroup;
    fb = inject(FormBuilder)
    route = inject(ActivatedRoute)
    path: string;
    index: number;
    oImage: OImage;
    fs = inject(FirestoreService)

    ngOnInit(): void {
        this.initForm()
        this.path = this.route.snapshot.paramMap.get('path')
        this.index = parseInt(this.route.snapshot.paramMap.get('index'))
        this.getOImage()
            .then((oImages: OImage[]) => {
                this.oImage = oImages[this.index]
                this.patchForm(this.oImage)
            })
        console.log(this.path, this.index);
    }

    initForm() {
        this.oImageForm = this.fb.group({
            photographerName: new FormControl(null)
        })
    }

    getOImage() {
        return this.fs.getFieldInDocument(this.path, 'oImages')

    }
    patchForm(oImage: OImage) {
        this.oImageForm.patchValue({
            photographerName: oImage.photographerName
        })
    }
    onUpdateOImage() {
        console.log(this.oImageForm.value)

    }
    onCancel() {

    }
}
