import { Component, inject, Input, OnInit } from '@angular/core';
import { UiStore } from '../../../../services/ui.store';

@Component({
    selector: 'app-visitor-band-body',
    imports: [],
    templateUrl: './visitor-band-body.component.html',
    styleUrl: './visitor-band-body.component.scss'
})
export class VisitorBandBodyComponent {
    uiStore = inject(UiStore)
}
