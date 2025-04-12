import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, viewChild, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationService } from '../../../navigation/navigation.service';
import { Band } from '../../../shared/models/band.model';
import { Router } from '@angular/router';
import { UiStore } from '../../../services/ui.store';


interface BandsByInitiator {
    initiator: string;
    bands: Band[]
}

@Component({
    selector: 'app-visitor-bands-menu',
    imports: [
        MatMenuModule,
        MatButtonModule
    ],
    templateUrl: './visitor-bands-menu.component.html',
    styleUrl: './visitor-bands-menu.component.scss'
})
export class VisitorBandsMenuComponent implements AfterViewInit {
    @Input() public buttonClicked: boolean;
    navigationService = inject(NavigationService);
    bandsByInitiatorArray: BandsByInitiator[] = [];
    // @ViewChild('menuButton') menuButton!: ElementRef<HTMLButtonElement>;
    @ViewChild('menuButton') menuButton!: any;
    @ViewChild('paragraph') paragraph!: ElementRef<HTMLButtonElement>;
    router = inject(Router);
    uiStore = inject(UiStore)

    // readonly menuButton = viewChild.required<ElementRef>('menuButton')

    constructor(private cdr: ChangeDetectorRef) {
        this.navigationService.getBandsByInitiatorArray()
            .then((bandsByInitiatorArray: BandsByInitiator[]) => {
                this.bandsByInitiatorArray = bandsByInitiatorArray
            })
            .catch((err: any) => {
                // console.log(err);
            })

    }


    ngAfterViewInit(): void {
        this.cdr.detectChanges();
        // const menuButton = this.menuButton()
        // // console.log(this.menuButton)
        // // console.log(this.paragraph.nativeElement)

        if (this.menuButton) {

            // // console.log(typeof this.menuButton)
            // // console.log(this.menuButton._elementRef)
            // // console.log(this.menuButton._elementRef.nativeElement)
            // this.menuButton._elementRef.nativeElement.click()
            // this.menuButton.nativeElement.click()
        }

    }


    onButtonClick() {
        // console.log('clicked')
    }
    onMyButtnClick() {
        // console.log('my button clicked')
    }

    onBandSelected(bandId: string) {
        this.router.navigate(['visitor-band', { bandId: bandId }])
    }

}
