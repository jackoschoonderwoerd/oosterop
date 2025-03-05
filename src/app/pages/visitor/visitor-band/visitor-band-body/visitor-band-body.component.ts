import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-visitor-band-body',
    imports: [],
    templateUrl: './visitor-band-body.component.html',
    styleUrl: './visitor-band-body.component.scss'
})
export class VisitorBandBodyComponent implements OnInit {
    @Input() public body: string

    ngOnInit(): void {
        console.log(this.body)
    }
}
