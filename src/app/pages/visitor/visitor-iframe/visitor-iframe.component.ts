import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-visitor-iframe',
    imports: [MatIconModule, MatProgressSpinnerModule],
    templateUrl: './visitor-iframe.component.html',
    styleUrl: './visitor-iframe.component.scss'
})
export class VisitorIframeComponent implements OnInit {
    route = inject(ActivatedRoute);
    safeUrl: SafeResourceUrl;;
    sanitizer = inject(DomSanitizer)
    source: string;
    router = inject(Router);
    isLoading: boolean = true

    ngOnInit(): void {
        const url = this.route.snapshot.paramMap.get('url');
        this.source = this.route.snapshot.paramMap.get('source')
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    onBack() {
        this.router.navigateByUrl(this.source)
    }
    onIframeLoad(e) {
        // console.log('onIframeLoad()', e)
        this.isLoading = false
    }
    onIframeError() {
        // console.log('onIframeError()')
    }
}
