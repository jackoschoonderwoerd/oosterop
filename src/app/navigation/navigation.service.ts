import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { Band } from '../shared/models/band.model';
import { FirestoreService } from '../services/firestore.service';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    fs = inject(FirestoreService)

    private bandsSubject = new BehaviorSubject<Band[]>(null);
    bands$: any = this.bandsSubject.asObservable();


    visitorMenuItems: string[] = ['anouncements', 'tour-periods', 'contact'];
    adminMenuItems: string[] = ['anouncements', 'musicians', 'bands']

    getAdminMenuItems() {
        return this.adminMenuItems;
    }
    getVisitorMenuItems() {
        return this.visitorMenuItems
    }
    getBandsObservable() {
        return this.fs.collection(`bands`)
            .pipe(take(1))
            .subscribe((bands: Band[]) => {
                this.bandsSubject.next(bands)
                this.bands$ = this.bandsSubject.asObservable()
            })
    }

}
