import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Musician } from '../../../../../shared/models/musician.model';
import { FirestoreService } from '../../../../../services/firestore.service';
import { take } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MusicianSelectorComponent } from '../../../../../shared/musician-selector/musician-selector.component';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { MusicianComponent } from '../../../../../shared/musician/musician.component';
import { OImage } from '../../../../../shared/models/o_image.model';
import { JsonPipe } from '@angular/common';
import { ArrayService } from '../../../../../services/array.service copy';

@Component({
    selector: 'app-band-members',
    imports: [
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MusicianSelectorComponent,
        MusicianComponent,
        JsonPipe,

    ],
    templateUrl: './band-members.component.html',
    styleUrl: './band-members.component.scss'
})
export class BandMembersComponent implements OnInit {
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService)
    bandId: string;
    bandMemberIds: string[] = [];

    router = inject(Router);
    sb = inject(SnackbarService);
    bandMembers: Musician[] = [];
    oImages: OImage[] = [];
    arrayService = inject(ArrayService)

    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        const path = `bands/${this.bandId}`
        this.fs.getFieldInDocument(path, 'bandMemberIds')
            .then((bandMemberIds: string[]) => {
                this.bandMemberIds = bandMemberIds;
                this.getBandMembers()
                console.log(this.bandMemberIds)
            })
    }

    getBandMembers() {
        console.log('getBandMembers()')
        this.bandMemberIds.forEach((id: string) => {
            const path = `musicians/${id}`
            this.fs.getDoc(path)
                .pipe(take(1))
                .subscribe((bandMember: Musician) => {
                    this.bandMembers.push(bandMember)
                })
        })
    }

    musicianIdSelected(musicianId: string) {

        console.log(musicianId)
        const path = `bands/${this.bandId}`
        this.fs.addElementToArray(path, 'bandMemberIds', musicianId)
            .then((res: any) => {
                console.log(res)
                this.getBandMemberIds()
                    .then((bandmemberIds: string[]) => {
                        this.bandMemberIds = bandmemberIds
                        this.bandMembers = [];
                        this.getBandMembers();
                    })
            })

            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })

    }
    getBandMemberIds() {
        const path = `bands/${this.bandId}`
        return this.fs.getFieldInDocument(path, 'bandMemberIds')
    }

    removeBandMember(memberId: string) {
        console.log(memberId)
        const path = `bands/${this.bandId}`
        this.fs.removeElementFromArray(path, 'bandMemberIds', memberId)
            .then((res: any) => {
                console.log(res)
                this.bandMembers = [];
                this.getBandMemberIds()
                    .then((bandMemberIds: string[]) => {
                        this.bandMemberIds = bandMemberIds
                        this.getBandMembers();

                    })
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })

    }

    onMove(index: number, direction: string) {
        console.log('1 onMove()')
        if (direction === 'up') {
            const newBandMemberIds = this.arrayService.move(this.bandMemberIds, index, index - 1)
            this.updateBandMemers(newBandMemberIds)
        } else if (direction === 'down') {
            const newBandMemberIds = this.arrayService.move(this.bandMemberIds, index, index + 1)
            this.updateBandMemers(newBandMemberIds)
        }
    }

    updateBandMemers(bandMemberIds: string[]) {
        this.bandMembers = []
        console.log('2 updateBandMembers()')
        this.bandMemberIds = [];
        console.log('bandMemberIds: ', this.bandMemberIds)
        this.fs.updateField(`bands/${this.bandId}`, 'bandMemberIds', bandMemberIds)
            .then((res: any) => {
                this.getBandMemberIds()
                    .then((bandMemberIds: string[]) => {
                        console.log(bandMemberIds)
                        return bandMemberIds
                    })
                    .then((bandMemberIds: string[]) => {
                        this.bandMemberIds = bandMemberIds
                        this.getBandMembers()
                    })
                // console.log(res);
                // this.bandMemberIds = bandMemberIds;
                // this.getBandMembers();
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    onCancel() {
        this.router.navigate(['band', { bandId: this.bandId }])
    }
}
