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
export class AddImageComponent {
    @Input() public pathToFolder: string;
    @Output() filePathChanged = new EventEmitter<FileData>
    sb = inject(SnackbarService);
    addImageService = inject(AddImageService)
    maxWidth: number = 900;
    maxHeight: number = 900;
    fileType: string = 'jpeg';
    storageService = inject(StorageService)



    onFileSelected(event: Event) {
        console.log(this.pathToFolder)
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.addImageService.resizeImageFile(file, this.maxWidth, this.maxHeight, this.fileType,)
                .then((resizedFile: File) => {

                    return this.storageService.upload(this.pathToFolder, resizedFile)
                })

                .then((downloadUrl: string) => {
                    // console.log(downloadUrl)
                    const fileData: FileData = {
                        filePath: downloadUrl,
                        filename: file.name
                    }
                    this.filePathChanged.emit(fileData)
                })
                .catch((err => console.log(err)))
        }
    }
}
