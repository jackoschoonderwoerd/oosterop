import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-iframe',
    imports: [MatProgressSpinnerModule],
    templateUrl: './iframe.component.html',
    styleUrl: './iframe.component.scss'
})
export class IframeComponent {
    @Input() public href: string;
    isLoading = true;

    onIframeLoad() {
        this.isLoading = false; // Hide spinner when iframe loads
    }
}
