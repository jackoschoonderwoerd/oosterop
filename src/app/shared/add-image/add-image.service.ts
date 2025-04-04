import { inject, Injectable } from '@angular/core';
import { StorageService } from '../../services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AddImageService {


    storageService = inject(StorageService)

    constructor() { }

    resizeImageFile(file: File, maxWidth, maxHeight, fileType): Promise<File> {
        const filename = file.name
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Maintain aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    const scale = Math.min(maxWidth / width, maxHeight / height);
                    width *= scale;
                    height *= scale;
                }

                // Resize image on canvas
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);



                // Convert to Base64
                // const base64Image = canvas.toDataURL(file.type);
                const base64String = canvas.toDataURL(`image/${fileType}`, 0.8);

                const blob = this.stringToBlob(base64String)
                const file = this.blobToFile(blob, filename)
                resolve(file);
            };

            img.onerror = (error) => reject(error);
        });
    }

    // uploadImage(base64String: string, filename: string) {
    //     const byteString = atob(base64String.split(',')[1]);
    //     const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
    //     const arrayBuffer = new ArrayBuffer(byteString.length);
    //     const intArray = new Uint8Array(arrayBuffer);
    //     for (let i = 0; i < byteString.length; i++) {
    //         intArray[i] = byteString.charCodeAt(i);
    //     }
    //     const blob = new Blob([arrayBuffer], { type: mimeString });

    //     const file = this.blobToFile(blob, filename)
    //     return this.storageService.upload(`images/resize/canvas/${filename}`, file)
    // }

    stringToBlob(base64String) {
        const byteString = atob(base64String.split(',')[1]);
        const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([arrayBuffer], { type: mimeString });
    }

    blobToFile(blob: Blob, fileName: string): File {
        return new File([blob], fileName, { type: blob.type });
    }
}
