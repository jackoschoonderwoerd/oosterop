import { EventEmitter, Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from '../../../../../services/firestore.service';
import { Musician } from '../../../../../shared/models/musician.model';

@Injectable({
    providedIn: 'root'
})
export class BandmembersService {


    bandNameSubject = new BehaviorSubject<string[]>(null);
    anouncements$: any = this.bandNameSubject.asObservable();

    bandMemberIdsChanged = new EventEmitter<void>()
    changingMusician = new EventEmitter<Musician>();
    changingBandmember = new EventEmitter<Musician>();
    filterChanged = new EventEmitter<string>();
    musicianUpdated = new EventEmitter<void>();
    musiciansChanged = new EventEmitter<void>();


    constructor(
        private firestore: Firestore,
        private fs: FirestoreService
    ) { }




    async getBandMembers(bandMemberIds: string[]) {
        const promises = bandMemberIds.map(id => {
            const userRef = doc(this.firestore, 'musicians', id);
            return getDoc(userRef).then(snapshot => snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
        });
        return Promise.all(promises);
    }

    async getBandName(bandId: string): Promise<any> {
        return this.fs.getFieldInDocument(`bands/${bandId}`, 'name')
    }
}
