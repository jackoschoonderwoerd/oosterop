import { EventEmitter, Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from '../../../../../services/firestore.service';
import { Musician } from '../../../../../shared/models/musician.model';

@Injectable({
    providedIn: 'root'
})
export class BandmembersService {


    bandMemberIdsChanged = new EventEmitter<void>()
    bandNameSubject = new BehaviorSubject<string[]>(null);
    anouncements$: any = this.bandNameSubject.asObservable();

    changingMusician = new EventEmitter<Musician>()


    constructor(
        private firestore: Firestore,
        private fs: FirestoreService
    ) { }




    async getBandMembers(bandMemberIds: string[]) {
        const promises = bandMemberIds.map(id => {
            const userRef = doc(this.firestore, 'musicians', id);
            console.log(userRef)
            return getDoc(userRef).then(snapshot => snapshot.exists() ? snapshot.data() : null);
        });
        return Promise.all(promises);
    }

    async getBandName(bandId: string): Promise<any> {
        return this.fs.getFieldInDocument(`bands/${bandId}`, 'name')
    }


    // onBandmemerIdsChanged(bandmemberIds: string[]) {
    //     this.bandMemberIdsChanged.emit(bandmemberIds)
    // }
}
