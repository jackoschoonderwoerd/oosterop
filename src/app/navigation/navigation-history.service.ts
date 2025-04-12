import { inject, Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UiService } from '../services/ui.service';

@Injectable({
    providedIn: 'root',
})
export class NavigationHistoryService {
    uiService = inject(UiService)
    private history: string[] = [];
    private future: string[] = [];

    constructor(private router: Router) {
        this.uiService.navigationHistoryChanged.subscribe((currentUrl: string) => {
            console.log(currentUrl)
        })
    }

    updateNavigationHistory(currentUrl: string) {
        // if (this.history.length === 0 || this.history[this.history.length - 1] !== currentUrl) {
        //     this.history.push(currentUrl);
        // }
        // this.future = [];
    }


    back(): string | null {
        // if (this.history.length > 1) {
        //     const current = this.history.pop()!;
        //     this.future.push(current);
        //     // console.log(this.history[this.history.length - 1])
        //     return this.history[this.history.length - 1];
        // }
        return null;
    }

    forward(): string | null {
        // console.log(this.future)
        // if (this.future.length > 0) {
        //     const next = this.future.pop()!;
        //     this.history.push(next);
        //     // console.log(next)
        //     return next;
        // }
        return null;
    }

    canGoForward(): boolean {
        return this.future.length > 0;
    }

    canGoBack(): boolean {
        return this.history.length > 1;
    }
}
