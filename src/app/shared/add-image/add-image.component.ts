import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../services/storage.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../services/snackbar.service';

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
    @Input() public path: string
    file: File;
    storage = inject(StorageService);
    fs = inject(FirestoreService)
    @Output() filePathChanged = new EventEmitter<FileData>
    sb = inject(SnackbarService)

    ngOnInit(): void {
        console.log(this.path);
    }
    onFileInputChange(event) {
        const file: File = event.target.files[0]
        this.storeFile(file)
    }

    storeFile(file: File) {
        const path = `path/${file.name}`
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
