import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-visitor-contact',
    imports: [],
    templateUrl: './visitor-contact.component.html',
    styleUrl: './visitor-contact.component.scss'
})
export class VisitorContactComponent {

    router = inject(Router)

    onCreateRoute() {
        this.router.navigate(['home', { bandId: '9U7OmPfFKpojJttUaV5I' }])
    }
}
