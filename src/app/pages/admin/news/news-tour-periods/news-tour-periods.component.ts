import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-news-tour-periods',
    imports: [],
    templateUrl: './news-tour-periods.component.html',
    styleUrl: './news-tour-periods.component.scss'
})
export class NewsTourPeriodsComponent {
    @Input() header: string
}
