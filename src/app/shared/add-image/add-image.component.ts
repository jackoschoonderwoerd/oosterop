import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../services/storage.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../services/snackbar.service';
import { AddImageService } from './add-image.service';
import { DocumentReference } from '@angular/fire/firestore';

interface FileData {
    filePath: string;
    filename: string;
}

@Component({
    selector: 'app-add-image',
    imports: [MatButtonModule],
    templateUrl: './add-image.component.html',
    styleUrl: './add-image.component.scss'
})
export class AddImageComponent implements OnInit {
    @Input() public path: string;
    @Input() public articleheader: string;
    file: File;
    filename: string
    storage = inject(StorageService);
    fs = inject(FirestoreService)
    @Output() filePathChanged = new EventEmitter<FileData>
    sb = inject(SnackbarService);
    addImageService = inject(AddImageService)
    maxWidth: number = 600;
    maxHeight: number = 600;
    fileType: string = 'jpeg';
    storageService = inject(StorageService)

    ngOnInit(): void {
        console.log(this.path);
    }
    onFileInputChange(event) {
        const file: File = event.target.files[0]
        this.storeFile(file)
    }

    onFileSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        console.log(file.name.split('.')[0] + '.jpeg');
        this.filename = file.name.split('.')[0] + `_${this.maxWidth}_X_${this.maxHeight}` + `.${this.fileType}`
        // return;
        if (file) {
            this.addImageService.resizeImageFile(file, this.maxWidth, this.maxHeight, this.fileType,)
                .then((resizedBase64) => {
                    console.log(resizedBase64)

                    // this.resizedImageBase64 = resizedBase64; // Store resized image
                    return this.storageService.upload(this.path, resizedBase64)
                })
                .then((downloadUrl: string) => {
                    console.log(downloadUrl)
                    const fileData: FileData = {
                        filePath: downloadUrl,
                        filename: this.filename
                    }
                    this.filePathChanged.emit(fileData)
                    return;
                    return this.fs.addDoc(`images/resize/canvas`, { downloadUrl })
                })
                .then((docRef: DocumentReference) => {
                    console.log(docRef.id)
                })
        }
    }

    storeFile(file: File) {
        // const path = `path/${file.name}`
        this.storage.upload(this.path, file)
            .then((filePath: string) => {
                const fileData: FileData = {
                    filePath: filePath,
                    filename: file.name
                }
                this.filePathChanged.emit(fileData)
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to:  ${err.message}`)
            })
    }

}
