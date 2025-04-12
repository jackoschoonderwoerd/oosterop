import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { Band } from '../shared/models/band.model';
import { FirestoreService } from '../services/firestore.service';
import { BandMenuItem } from '../shared/models/band-menu-item.model';
import { MenuItem } from '../shared/models/menu-item.model';

interface BandsByInitiator {
    initiator: string;
    bands: Band[]
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    fs = inject(FirestoreService)



    getBandsByInitiatorArray() {
        const promise = new Promise((resolve, reject) => {
            let bandsByInitiatorArray: BandsByInitiator[] = []

            this.fs.collection(`bands`).pipe(take(1))
                .subscribe((bands: Band[]) => {
                    bands.forEach((band: Band) => {
                        const bandsByInitiator: BandsByInitiator = {
                            initiator: band.initiator ? band.initiator : band.name,
                            bands: []
                        }
                        bandsByInitiatorArray.push(bandsByInitiator);
                    })
                    // remove duplicates
                    bandsByInitiatorArray = [...new Map(bandsByInitiatorArray.map(obj => [obj.initiator, obj])).values()];
                    // // console.log(this.bandsByInitiatorArray)

                    // add bands to initiator

                    bands.forEach((band: Band) => {
                        // // console.log(band)
                        bandsByInitiatorArray.forEach((bandsByInitator: BandsByInitiator, index) => {
                            if (band.initiator === bandsByInitator.initiator) {
                                bandsByInitiatorArray[index].bands.push(band)
                            }
                        })
                    })
                    // // console.log(this.bandsByInitiatorArray)
                    resolve(bandsByInitiatorArray)
                })
        })
        return promise
    }


}
