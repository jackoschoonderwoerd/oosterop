import { Component, Input, OnInit } from '@angular/core';
import { OImage } from '../../../../shared/models/o_image.model';
import { LoadingIndicatorComponent } from '../../../../shared/loading-indicator/loading-indicator.component';

@Component({
    selector: 'app-visitor-band-o-images',
    imports: [LoadingIndicatorComponent],
    templateUrl: './visitor-band-o-images.component.html',
    styleUrl: './visitor-band-o-images.component.scss'
})
export class VisitorBandOImagesComponent implements OnInit {
    @Input() public oImages: OImage[];
    isLoading: boolean = true

    ngOnInit(): void {
        console.log(this.oImages)
    }

    onLoad() {
        console.log('loaded')
        setTimeout(() => {
            this.isLoading = false
        }, 3000);
    }
}
