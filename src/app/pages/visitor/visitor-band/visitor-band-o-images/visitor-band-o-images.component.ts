import { Component, inject, Input, OnInit } from '@angular/core';
import { OImage } from '../../../../shared/models/o_image.model';
import { UiStore } from '../../../../services/ui.store';


@Component({
    selector: 'app-visitor-band-o-images',
    imports: [],
    templateUrl: './visitor-band-o-images.component.html',
    styleUrl: './visitor-band-o-images.component.scss'
})
export class VisitorBandOImagesComponent implements OnInit {
    @Input() public oImages: OImage[];
    isLoading: boolean = true
    uiStore = inject(UiStore)

    ngOnInit(): void {
        // console.log(this.uiStore.oImages())
    }



    // onLoad() {
    //     // // console.log('loaded')
    //     setTimeout(() => {
    //         this.isLoading = false
    //     }, 3000);
    // }
}
