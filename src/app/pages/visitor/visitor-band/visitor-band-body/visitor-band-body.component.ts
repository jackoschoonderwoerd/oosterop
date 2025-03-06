import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-visitor-band-body',
    imports: [],
    templateUrl: './visitor-band-body.component.html',
    styleUrl: './visitor-band-body.component.scss'
})
export class VisitorBandBodyComponent {
    @Input() public body: string


}
