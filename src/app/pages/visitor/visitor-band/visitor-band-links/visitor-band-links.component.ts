import { Component, inject, Input } from '@angular/core';
import { Link } from '../../../../shared/models/link.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-visitor-band-links',
    imports: [MatExpansionModule, MatIconModule],
    templateUrl: './visitor-band-links.component.html',
    styleUrl: './visitor-band-links.component.scss'
})
export class VisitorBandLinksComponent {
    @Input() public links: Link[];
    router = inject(Router)
    route = inject(ActivatedRoute)

    onUrl(url: string) {
        console.log(this.router.url)
        const source = this.router.url;
        console.log(url)
        this.router.navigate(['visitor-iframe', { url, source }])
    }
}
