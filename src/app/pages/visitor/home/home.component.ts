import { Component, inject, OnInit } from '@angular/core';
import { VAnouncementsComponent } from './v-anouncements/v-anouncements.component';
import { Anouncement } from '../../../shared/models/anouncement.model';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
    selector: 'app-home',
    imports: [VAnouncementsComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

}
