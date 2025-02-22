import { Component, inject, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../auth/auth.store';
import { BehaviorSubject, take } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { Band } from '../../shared/models/band.model';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-visitor',
    imports: [
        RouterModule,
        MatToolbarModule,
        MatMenuModule,
        AsyncPipe,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './visitor.component.html',
    styleUrl: './visitor.component.scss'
})
export class VisitorComponent implements OnInit {
    dataSubject = new BehaviorSubject<Band[]>(null)
    // data$:Observable<Band[]>
    bands$: any = this.dataSubject.asObservable()

    // bands: Band[] = []

    router = inject(Router)
    authStore = inject(AuthStore);
    fs = inject(FirestoreService);
    items: string[] = ['item 1', 'item 2']

    ngOnInit(): void {
        this.fs.collection(`bands`)
            .pipe(take(1))
            .subscribe((bands: Band[]) => {
                this.dataSubject.next(bands)
                this.bands$ = this.dataSubject.asObservable()
            })
    }
    onLogin() {
        this.router.navigateByUrl('login')
    }
    onBandSelected(bandId: string) {
        console.log(bandId)
        this.router.navigate(['visitor/visitor-band', bandId])
    }
}
