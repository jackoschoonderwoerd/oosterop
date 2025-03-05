import { Component, Input, OnInit } from '@angular/core';
import { OImage } from '../../../../shared/models/o_image.model';

@Component({
    selector: 'app-visitor-band-o-images',
    imports: [],
    templateUrl: './visitor-band-o-images.component.html',
    styleUrl: './visitor-band-o-images.component.scss'
})
export class VisitorBandOImagesComponent implements OnInit {
    @Input() public oImages: OImage[];

    ngOnInit(): void {
        console.log(this.oImages)
    }
}
