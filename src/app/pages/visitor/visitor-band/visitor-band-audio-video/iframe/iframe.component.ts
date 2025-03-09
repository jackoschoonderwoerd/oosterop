import { Component, inject, Input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-iframe',
    imports: [MatProgressSpinnerModule],
    templateUrl: './iframe.component.html',
    styleUrl: './iframe.component.scss'
})
export class IframeComponent implements OnInit {
    @Input() public code: string;
    isLoading = true;
    safeUrl: SafeUrl
    sanitizer = inject(DomSanitizer);

    ngOnInit() {
        const href = this.getHref();
        this.safeUrl = this.sanitize(href)
    }

    getHref() {
        const array = this.code.split(' ')
        const element: string = array.find(element => element.includes('src="'))
        const index: number = element.indexOf('"')
        return (element.slice(index + 1, -1))
    }

    sanitize(href): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(href)
    }

    onIframeLoad() {
        this.isLoading = false; // Hide spinner when iframe loads
    }
}
