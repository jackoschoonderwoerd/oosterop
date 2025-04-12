import { Injectable } from '@angular/core';


import {
    Storage,
    ref,
    deleteObject,
    uploadBytes,
    uploadString,
    uploadBytesResumable,
    percentage,
    getDownloadURL,
    StorageError,
    getMetadata
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

import { FirebaseError } from '@angular/fire/app';


@Injectable({
    providedIn: 'root'
})
export class StorageService {

    uploadPercent: Observable<number>;

    constructor(
        private storage: Storage,
        // private afStorage: AngularFireStorage

    ) { }

    async upload(folder: string, file: File | null): Promise<string> {

        // const ext = file!.name.split('.').pop();

        const path = `${folder}/${file.name}`;

        if (file) {
            try {
                const storageRef = ref(this.storage, path);
                const task = uploadBytesResumable(storageRef, file);
                // this.uploadPercent = percentage(task);
                await task;
                const url = await getDownloadURL(storageRef);
                return url;
            } catch (e: any) {
                console.error(e);
            }
        }
    }

    uploadMultipleFiles(folderName, files: File[]) {
        const downloadUrls: string[] = []

        return Promise.all(
            files.map(file => {
                return new Promise((resolve, reject) => {
                    this.upload(folderName, file).then((downloadUrl: string) => {
                        // console.log(downloadUrl)

                        downloadUrls.push(downloadUrl)
                        resolve('')
                    })

                })
            })
        )
            .then((res: any) => {

            })
    }

    deleteFile(path) {
        const fileRef = ref(this.storage, path)
        return deleteObject(fileRef)
    }

    checkForDuplicateFilenameInStorage(pathToFolder: string, filename: string) {
        const path = `${pathToFolder}/${filename}`
        const storageRef = ref(this.storage, path)
        const promise = new Promise((resolve, reject) => {

            getMetadata(storageRef)
                .then((res: any) => {
                    reject('file exists')
                })
                .catch((err: FirebaseError) => {
                    resolve('file doesn\'t exist')
                })
        })
        return promise


    }
}

