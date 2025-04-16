import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BandmembersService } from '../bandmembers.service';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../../../../services/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArrayService } from '../../../../../../services/array.service';
import { SnackbarService } from '../../../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { Musician } from '../../../../../../shared/models/musician.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../../shared/confirm/confirm.component';

@Component({
    selector: 'app-bandmembers-list',
    imports: [
        AsyncPipe,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,

    ],
    templateUrl: './bandmembers-list.component.html',
    styleUrl: './bandmembers-list.component.scss'
})
export class BandmembersListComponent implements OnInit {
    private bandmembersSubject = new BehaviorSubject<any[]>(null);
    bandmembers$: Observable<any[]> = this.bandmembersSubject.asObservable();

    private bandNameSubject = new BehaviorSubject<string>(null);
    bandName$: Observable<string> = this.bandNameSubject.asObservable();

    bMService = inject(BandmembersService);
    route = inject(ActivatedRoute)
    fs = inject(FirestoreService)
    sb = inject(SnackbarService)
    updatingBandmembers: boolean = false;
    bandId: string;
    arrayService = inject(ArrayService);
    dialog = inject(MatDialog)

    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        this.getBandName();
        this.getBandmemberIds()
            .then((bandmemberIds: string[]) => {
                this.getBandmembersAsync(bandmemberIds)
            })
        this.bMService.bandMemberIdsChanged.subscribe(() => {
            // console.log('bandmemberChanged')
            this.getBandmemberIds()
                .then((bandmemberIds: string[]) => {
                    this.getBandmembersAsync(bandmemberIds)
                })
        })
        this.bMService.musiciansChanged.subscribe(() => {
            setTimeout(() => {
                // console.log('bandmemberChanged')
                this.getBandmemberIds()
                    .then((bandmemberIds: string[]) => {
                        this.getBandmembersAsync(bandmemberIds)
                    })
            }, 1000);
        });
        setTimeout(() => {
            this.updatingBandmembers = false;
        }, 5000);
    }

    async getBandName() {
        try {
            const bandName = await this.bMService.getBandName(this.bandId);
            this.bandNameSubject.next(bandName)
        } catch (error) {
            // console.log(`error getting band name:, ${error}`)
        }
        // this.bMService.getBandName(this.bandId)
    }
    async getBandmembersAsync(bandmemberIds: string[]) {
        if (bandmemberIds) {
            // // console.log(bandmemberIds)
            try {
                const bandmembers = await this.bMService.getBandMembers(bandmemberIds);
                // // console.log(bandmembers);
                this.bandmembersSubject.next(bandmembers)
                this.updatingBandmembers = false;
            } catch (error) {
                console.error('Error fetching bandMembers:', error);
            }
        }
    }

    onEdit(bandmember: Musician) {
        // console.log(bandmember)
        this.bMService.changingBandmember.emit(bandmember)
    }
    onDelete(bandmember: Musician) {
        // console.log(bandmember)
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: bandmember.name
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                this.fs.removeElementFromArray(`bands/${this.bandId}`, 'bandMemberIds', bandmember.id)
                    .then((res: any) => {
                        this.sb.openSnackbar(`bandmember removed`)
                        this.getBandmemberIds()
                            .then((bandmemberIds: string[]) => {
                                this.getBandmembersAsync(bandmemberIds)
                            })
                    })
                    .catch((err: FirebaseError) => {
                        // console.log(err)
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar(`operation aborted by user`)
            }
        })
    }

    getBandmemberIds() {
        this.updatingBandmembers = true
        const promise = new Promise((resolve, reject) => {
            this.fs.getFieldInDocument(`bands/${this.bandId}`, 'bandMemberIds')
                .then((bandMemberIds: string[]) => {
                    // // console.log(bandMemberIds)
                    resolve(bandMemberIds)
                })
        })
        return promise
    }
    populateFilter(bandmemberName) {
        this.bMService.filterChanged.emit(bandmemberName)
    }

    onMove(index: number, direction: string) {
        this.getBandmemberIds()
            .then((ids: string[]) => {
                // console.log(ids);
                // return;
                if (direction === 'up') {
                    const newIds = this.arrayService.move(ids, index, index - 1)
                    // console.log(newIds);
                    // return
                    this.updateBandMemberIds(newIds)
                        .then((res: any) => {
                            this.getBandmembersAsync(newIds)
                            this.updatingBandmembers = false;
                        })
                        .catch((err: FirebaseError) => {
                            // console.log(err);
                            this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                            setTimeout(() => {
                                this.updatingBandmembers = false;
                            }, 1000);
                        })
                } else if (direction === 'down') {
                    const newIds = this.arrayService.move(ids, index, index + 1)
                    this.updateBandMemberIds(newIds)
                        .then((res: any) => {
                            this.getBandmembersAsync(newIds)
                            this.updatingBandmembers = false;
                        })
                        .catch((err: FirebaseError) => {
                            // console.log(err);
                            this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                            setTimeout(() => {
                                this.updatingBandmembers = false;
                            }, 1000);
                        })

                }

            })
    }

    updateBandMemberIds(newIds: string[]) {
        const promise = new Promise((resolve, reject) => {
            this.fs.updateField(`bands/${this.bandId}`, 'bandMemberIds', newIds)
                .then((res: any) => {
                    this.sb.openSnackbar(`bandMemberIds updated`)
                    // this.bMService.musiciansChanged.emit();
                    resolve('')
                })
                .catch((err: FirebaseError) => {
                    // console.log(err);
                    this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    reject(err.message)
                })
        })
        return promise

    }
}
