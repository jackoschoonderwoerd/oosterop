import { Component, inject, Input } from '@angular/core';
import { Link } from '../../../../shared/models/link.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UiStore } from '../../../../services/ui.store';

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
    uiStore = inject(UiStore)

    onUrl(url: string) {
        // console.log(this.router.url)
        window.open(url, '_blank')
        // const source = this.router.url;
        // // console.log(url)
        // this.router.navigate(['visitor-iframe', { url, source }])
    }
}
