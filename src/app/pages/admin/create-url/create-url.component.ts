import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { Band } from '../../../shared/models/band.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-url',
    imports: [MatButtonModule],
    templateUrl: './create-url.component.html',
    styleUrl: './create-url.component.scss'
})
export class CreateUrlComponent implements OnInit {
    fs = inject(FirestoreService)
    bands: Band[] = [];
    url: string = '';
    sb = inject(SnackbarService)
    router = inject(Router)
    @ViewChild('createdUrl') public createdUrl: ElementRef;
    urlAvailable: boolean = false;


    ngOnInit(): void {
        this.fs.sortedCollection('bands', 'name', 'asc')
            .subscribe((bands: Band[]) => {
                this.bands = bands
            })
    }


    onBandSelected(bandId) {
        const origin = window.location.origin
        this.url = `${origin}/home;bandId=${bandId}`
        this.urlAvailable = true;
    }

    onCopyUrl(element: HTMLElement) {
        const url = element.innerText;
        navigator.clipboard.writeText(url)
            .then(() => {
                console.log('Copied', url)
                this.sb.openSnackbar(`url copied`)
                this.urlAvailable = false;
                this.createdUrl.nativeElement.innerText = '';
                this.url = '';
            })
            .catch((err: any) => {
                console.error('Copy failed', err)
                this.sb.openSnackbar(`copy failed due to; ${err}`)
            })
    }
}
