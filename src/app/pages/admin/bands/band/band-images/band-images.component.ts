import { Component, inject, OnInit } from '@angular/core';
import { AddImageComponent } from '../../../../../shared/add-image/add-image.component';
import { OImage } from '../../../../../shared/models/o_image.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    path: string;
    filePath: string;
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    router = inject(Router)


    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        console.log(this.bandId)
        this.path = `bands/${this.bandId}`
        this.getOImages();

    }

    getOImages() {
        this.fs.getFieldInDocument(this.path, 'oImages')
            .then((oImages: OImage[]) => {
                this.oImages = oImages
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    filePathReady(fileData: any) {
        console.log(fileData)
        const filePath = fileData.filePath
        const oImage: OImage = {
            imagePath: filePath,
            filename: fileData.filename,
            photographerName: null
        }
        console.log(oImage)
        this.fs.addElementToArray(this.path, 'oImages', oImage)
            .then((res: any) => {
                console.log(res);
                this.oImages = [];
                this.getOImages();
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })

    }
    onEditOImage(index) {
        this.router.navigate(['edit-o-image', { path: this.path, index }])
    }
}
