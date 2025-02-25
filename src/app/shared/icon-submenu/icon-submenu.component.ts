import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UiStore } from '../../services/ui.store';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-icon-submenu',
    imports: [MatIconModule, MatButtonModule],
    templateUrl: './icon-submenu.component.html',
    styleUrl: './icon-submenu.component.scss'
})
export class IconSubmenuComponent implements OnInit {
    uiStore = inject(UiStore)
    bandId: string;
    router = inject(Router);
    submenuItems: string[];
    // @Input() private bandId: string

    ngOnInit() {
        this.submenuItems = this.uiStore.subMenuItems();
        console.log(this.submenuItems)
        // console.log(this.bandId)
        setTimeout(() => {

            if (this.uiStore.band()) {
                this.bandId = this.uiStore.band().id
            }
            console.log(this.bandId)
        }, 1000);
    }

    onSubmenuSelected(subMenuItem: string) {
        console.log(subMenuItem)
        switch (subMenuItem) {
            case 'home':
                this.router.navigate(['visitor-band', { bandId: this.bandId }]);
                break;
            case 'reviews':
                this.router.navigate(['visitor-band-reviews', { bandId: this.bandId }]);
                break;
            case 'o-audios':

                this.router.navigate(['visitor-band-audios', { bandId: this.bandId }]);
                break;
            case 'concerts':
                this.router.navigate(['visitor-concerts', { bandId: this.bandId }]);

        }
    }
}
