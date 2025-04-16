import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-visibility-eyes',
    imports: [MatIconModule],
    templateUrl: './visibility-eyes.component.html',
    styleUrl: './visibility-eyes.component.scss'
})
export class VisibilityEyesComponent {
    @Input() public visible: boolean
}
