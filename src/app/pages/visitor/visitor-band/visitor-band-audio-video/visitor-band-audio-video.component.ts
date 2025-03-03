import { Component, inject, Input } from '@angular/core';

import { OAudio } from '../../../../shared/models/o-audio.model';
import { DomSanitizer } from '@angular/platform-browser';
import { IframeComponent } from './iframe/iframe.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-visitor-band-audio-video',
    imports: [IframeComponent, MatExpansionModule],
    templateUrl: './visitor-band-audio-video.component.html',
    styleUrl: './visitor-band-audio-video.component.scss'
})
export class VisitorBandAudioVideoComponent {

    @Input() public oAudios: OAudio[];
    hrefs: string[] = [];
    sanitizer = inject(DomSanitizer);
    isLoading: boolean = true

    ngOnInit(): void {
        console.log(this.oAudios)
        // const bandId = this.route.snapshot.paramMap.get('bandId')
        // this.getOAudios(bandId)
        this.oAudios.forEach((oAudio: OAudio) => {
            this.getIframeSrc(oAudio)
        })
    }

    // getOAudios(bandId: string) {
    //     const path = `bands/${bandId}`
    //     this.fs.getFieldInDocument(path, 'oAudios')
    //         .then((oAudios: OAudio[]) => {
    //             oAudios.forEach((oAudio: OAudio) => {
    //                 this.getIframeSrc(oAudio)
    //                 // const newIframe = oAudio.code as HTMLIFrameElement
    //             })

    //         })
    // }
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
