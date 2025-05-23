import { Component, inject, OnInit } from '@angular/core';
import { AddImageComponent } from '../../../../../shared/add-image/add-image.component';
import { OImage } from '../../../../../shared/models/o_image.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../../../../services/storage.service';
import { ConfirmService } from '../../../../../shared/confirm/confirm.service';

@Component({
    selector: 'app-band-images',
    imports: [AddImageComponent, MatButtonModule, MatIconModule],
    templateUrl: './band-images.component.html',
    styleUrl: './band-images.component.scss'
})
export class BandImagesComponent implements OnInit {
    oImages: OImage[] = [];
    route = inject(ActivatedRoute)
    bandId: string;
    pathToFolder: string;
    filePath: string;
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    router = inject(Router)
    collectionName = 'bands';
    documentId: string;
    storage = inject(StorageService)
    confirmService = inject(ConfirmService)



    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        // console.log(this.bandId)
        this.documentId = this.bandId
        this.pathToFolder = `bands/${this.bandId}`
        this.getOImages();

    }

    getOImages() {
        this.fs.getFieldInDocument(this.pathToFolder, 'oImages')
            .then((oImages: OImage[]) => {
                this.oImages = oImages
            })
            .catch((err: FirebaseError) => {
                // console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    filePathReady(fileData: any) {
        // console.log(fileData)
        const filePath = fileData.filePath
        const oImage: OImage = {
            imagePath: filePath,
            filename: fileData.filename,
            photographerName: null
        }
        // console.log(oImage)
        this.fs.addElementToArray(this.pathToFolder, 'oImages', oImage)
            .then((res: any) => {
                // console.log(res);
                this.oImages = [];
                this.getOImages();
            })
            .catch((err: FirebaseError) => {
                // console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })

    }
    onEdit(index) {
        this.router.navigate(['edit-o-image',
            {
                collectionName: this.collectionName,
                documentId: this.documentId,
                index
            }
        ])
    }
    onDelete(index) {
        this.confirmService.getConfirmation(index)
            .then((confirmation: boolean) => {
                if (confirmation) {

                    const doomedOImage: OImage = this.oImages[index]

                    const pathToFile = `${this.pathToFolder}/${doomedOImage.filename}`
                    this.removeFileFromStorage(pathToFile)
                        .then((res: any) => {
                            // console.log(res);
                            this.removeImagePathFromArray(doomedOImage)
                        })
                        .then((res: any) => {
                            // console.log(res)
                            this.getOImages();
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

    removeFileFromStorage(path) {
        // console.log(path);
        return this.storage.deleteFile(path)
    }

    removeImagePathFromArray(doomedImage: OImage) {
        return this.fs.removeElementFromArray(this.pathToFolder, 'oImages', doomedImage)
    }
    onCancel() {
        this.router.navigate(['band', { bandId: this.bandId }])
    }
}
// `David-Murray-4tet-by-Laurent-Elie-Badessi-FINAL_CROPPED_SML-2048x1441_900_X_900.jpeg`
//     `David-Murray-4tet-by-Laurent-Elie-Badessi-FINAL_CROPPED_SML-2048x1441_900_X_900.jpeg`
