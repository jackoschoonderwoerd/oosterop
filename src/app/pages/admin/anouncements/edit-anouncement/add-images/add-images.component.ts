import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { OImage } from '../../../../../shared/models/o_image.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { StorageService } from '../../../../../services/storage.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';

@Component({
    selector: 'app-add-images',
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInput,
        JsonPipe,
        MatIconModule
    ],
    templateUrl: './add-images.component.html',
    styleUrl: './add-images.component.scss'
})
export class AddImagesComponent implements OnInit {
    route = inject(ActivatedRoute)
    anouncementId: string;
    fs = inject(FirestoreService);
    storage = inject(StorageService)
    oImages: OImage[] = [];
    oImageForm: FormGroup;
    fb = inject(FormBuilder);
    sb = inject(SnackbarService);
    router = inject(Router);
    updatingPhotographerName: boolean;
    dialog = inject(MatDialog);
    activeImageIndex: number;

    ngOnInit(): void {
        this.initForm()
        this.anouncementId = this.route.snapshot.paramMap.get('anouncementId')
        console.log(this.anouncementId)
        this.getOImages()
    }
    initForm() {
        this.oImageForm = this.fb.group({
            photographerName: new FormControl(null)
        })
    }
    getOImages() {

        const path = `anouncements/${this.anouncementId}`
        this.fs.getFieldInDocument(path, 'oImages')
            .then((oImages: OImage[]) => {
                this.oImages = oImages;
                console.log(this.oImages)
            })
    }

    onFileInputChange(event) {
        const file: File = event.target.files[0]
        const filename = file.name
        const path = `anouncements/${this.anouncementId}`
        this.storeSingleFile(path, file)
            .then((imagePath: string) => {

                this.addToOImages(path, filename, imagePath)
            })
    }

    onEditPhotographerName(index: number) {
        this.activeImageIndex = index
        this.updatingPhotographerName = true;
        this.oImageForm.patchValue({
            photographerName: this.oImages[index].photographerName
        })
    }
    onUpdatePhotographerName() {
        const newName = this.oImageForm.value.photographerName
        this.oImages[this.activeImageIndex].photographerName = newName;
        console.log(this.oImages)
        this.updateImageArray()
            .then((res: any) => {
                console.log(res)
                this.oImageForm.reset();
                this.updatingPhotographerName = false;
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    private storeSingleFile(path, file) {
        return this.storage.upload(path, file)
    }

    addToOImages(path: string, filename: string, imagePath: string) {
        console.log(this.oImageForm.value.photographerName)
        const photographerName = this.oImageForm.value.photographerName;

        const oImage: OImage = {
            imagePath,
            filename: filename,
            photographerName: photographerName ? photographerName : null
        }
        this.fs.addElementToArray(path, 'oImages', oImage)
            .then((res: any) => {
                this.oImageForm.reset();
                this.getOImages()
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onDelete(oImage: OImage) {
        const filename = oImage.filename
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedelement: filename
            }
        })
        dialogRef.afterClosed().subscribe((status: boolean) => {
            if (status) {
                this.removeFromStorage(filename)
                    .then((res: any) => {
                        this.removeOImageFromDbArray(oImage)
                    })
                    .then((res: any) => {
                        console.log(res)
                        this.getOImages()
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err)
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar(`operation aborted by user`)
            }
        })
    }


    removeFromStorage(filename: string) {
        const path = `anouncements/${this.anouncementId}/${filename}`
        return this.storage.deleteFile(path)


    }
    removeOImageFromDbArray(oImage: OImage) {
        const path = `anouncements/${this.anouncementId}`
        console.log(path)
        // return;
        return this.fs.removeElementFromArray(path, 'oImages', oImage)
    }
    onCancel() {
        this.router.navigate(['edit-anouncement', { anouncementId: this.anouncementId }])
    }

    private updateImageArray() {
        const path = `anouncements/${this.anouncementId}`
        console.log(path)
        return this.fs.updateField(path, 'oImages', this.oImages)
    }
}
