import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'

@Component({
    selector: 'app-sidenav',
    imports: [MatIconModule, MatButtonModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

    @Output() closeSidenav = new EventEmitter<void>();

    onClose() {
        this.closeSidenav.emit()
    }
}
