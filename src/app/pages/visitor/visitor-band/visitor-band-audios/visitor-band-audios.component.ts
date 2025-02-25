import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { OAudio } from '../../../../shared/models/o-audio.model';
import { DomSanitizer } from '@angular/platform-browser';
import { IconSubmenuComponent } from '../../../../shared/icon-submenu/icon-submenu.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IframeComponent } from './iframe/iframe.component';

@Component({
    selector: 'app-visitor-band-audios',
    imports: [IconSubmenuComponent, IframeComponent, MatProgressSpinnerModule],
    templateUrl: './visitor-band-audios.component.html',
    styleUrl: './visitor-band-audios.component.scss'
})
export class VisitorBandAudiosComponent implements OnInit {
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService);
    oAudios: OAudio[] = [];
    src: string;
    https: string;
    safeUrl: any;
    hrefs: string[] = [];
    sanitizer = inject(DomSanitizer)
    isLoading: boolean = true



    ngOnInit(): void {
        const bandId = this.route.snapshot.paramMap.get('bandId')
        this.getOAudios(bandId)
    }

    getOAudios(bandId: string) {
        const path = `bands/${bandId}`
        this.fs.getFieldInDocument(path, 'oAudios')
            .then((oAudios: OAudio[]) => {
                oAudios.forEach((oAudio: OAudio) => {
                    this.getIframeSrc(oAudio)
                    // const newIframe = oAudio.code as HTMLIFrameElement
                })

            })
    }
    getIframeSrc(oAudio: OAudio) {
        const array = oAudio.code.split(' ')
        const element: string = array.find(element => element.includes('src="'))
        const index: number = element.indexOf('"')
        const href: string = element.slice(index + 1, -1)
        const safeUrl: any = this.sanitizer.bypassSecurityTrustResourceUrl(href);
        this.hrefs.push(safeUrl)
    }
    onIframeLoad() {
        console.log('load')
        this.isLoading = false;
    }
}
