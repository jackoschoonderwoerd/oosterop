import { AfterViewInit, Component, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../../../../services/firestore.service';
import { Musician } from '../../../../../../shared/models/musician.model';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { BandmemberCheckboxComponent } from './bandmember-checkbox/bandmember-checkbox.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../../services/snackbar.service';
import { BandmembersService } from '../bandmembers.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddMusicianComponent } from '../add-musician/add-musician.component';
import { Band } from '../../../../../../shared/models/band.model';
import { BandmembersListComponent } from '../bandmembers-list/bandmembers-list.component';
import { ConfirmComponent } from '../../../../../../shared/confirm/confirm.component';
import { WarningComponent } from '../../../../../../shared/warning/warning.component';
import { ConfirmService } from '../../../../../../shared/confirm/confirm.service';
import { MatDialog } from '@angular/material/dialog';

interface BandIdBandMemberId {
    bandId: string;
    bandMemberId: string
}

@Component({
    selector: 'app-bandmembers-table',
    imports: [
        AddMusicianComponent,
        AsyncPipe,
        BandmemberCheckboxComponent,
        BandmembersListComponent,
        ConfirmComponent,
        FormsModule,
        JsonPipe,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInput,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        WarningComponent
    ],
    templateUrl: './bandmembers-table.component.html',
    styleUrl: './bandmembers-table.component.scss'
})
export class BandmembersTableComponent implements OnInit, AfterViewInit {
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    bMService = inject(BandmembersService)
    musicians: Musician[] = [];
    // displayedColumns: string[] = ['name', 'edit', 'delete', 'context', 'instruments', 'checkbox']
    displayedColumns: string[] = ['name', 'context', 'instruments']
    dataSource = new MatTableDataSource();
    bandMemberIds: string[] = [];
    @ViewChildren('checkbox') checkboxes!: QueryList<MatCheckbox>;
    @ViewChild(MatSort) sort: MatSort;
    bandmembers: any[] = []
    bandId: string
    filterValue: string;
    updatingBandmembers: boolean = false;
    musician: Musician;
    confirmService = inject(ConfirmService);
    dialog = inject(MatDialog)


    constructor() {
        // Custom filter to exclude all but 'name' column from filtering
        this.dataSource.filterPredicate = (data: Musician, filter: string) => {
            const filterText = filter.trim().toLowerCase();
            return (
                data.name.toLowerCase().includes(filterText)
                // ||
                // data.role.toLowerCase().includes(filterText) ||
                // data.id.toString().includes(filterText) // Excludes 'email'
            );
        };
    }



    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId');
        this.bMService.filterChanged.subscribe((bandmemberName: string) => {
            console.log('filterChanged')
            this.populateFilter(bandmemberName);
        })
        this.bMService.musicianUpdated.subscribe(() => {
            setTimeout(() => {

                console.log('hi there')
                console.log(this.sort)
                this.dataSource.sort = this.sort;
            }, 1000);
        })
        this.getMusicians();
        this.bMService.musiciansChanged.subscribe(() => {
            setTimeout(() => {

                console.log('hi there')
                console.log(this.sort)
                this.dataSource.sort = this.sort;
            }, 1000);
        })

    }
    ngAfterViewInit(): void {

        setTimeout(() => {
            // console.log(this.sort)
            this.dataSource.sort = this.sort;
            // this.dataSource.sort.active = 'name'; // Default sorted column
            // this.dataSource.sort.direction = 'desc'; // Default sort direction (asc/desc)
            // this.dataSource.sort.start = 'desc'; // Ensures the default direction
        }, 5000);
    }

    initDatasource() {
        console.log(this.sort)
        this.dataSource.sort = this.sort;
    }

    getMusicians() {
        // console.log('getMusicians()')
        this.fs.collection(`musicians`)
            // .pipe(take(1))
            .subscribe((musicians: Musician[]) => {
                // console.log(musicians)
                this.musicians = musicians;
                this.dataSource = new MatTableDataSource(musicians)
            })
    }


    getBandMemberIds() {
        const promise = new Promise((resolve, reject) => {
            this.fs.getFieldInDocument(`bands/${this.bandId}`, 'bandMemberIds')
                .then((bandMemberIds: string[]) => {
                    resolve(bandMemberIds)
                })
        })
        return promise
    }

    applyFilter(event: Event) {
        this.filterValue = (event.target as HTMLInputElement).value;
        console.log(event)
        this.dataSource.filter = this.filterValue.trim().toLowerCase();
    }
    onEdit(musician: Musician) {
        console.log(musician)
        this.bMService.changingMusician.emit(musician);
    }
    onDelete(musicianId: string) {
        // console.log(musicianId)
        this.checkEligibility(musicianId)
        return

        // A CREATE4 ARRAY WITH OBJECTS {MUSCIANID:?, BANDID:?}
        this.getAllBandIdsBandMemberIds().then((bandIdsBandMemberIds: BandIdBandMemberId[]) => {
            this.getBandIdsMusicianActive(musicianId, bandIdsBandMemberIds)
                .then((bandIdsMusisianActive: string[]) => {
                    if (bandIdsMusisianActive.length > 0) {
                        console.log(bandIdsMusisianActive)
                        this.getBandnamesById(bandIdsMusisianActive).then((bands: Band[]) => {
                            const bandNames = [];
                            let bandnamesString = ''
                            bands.forEach((band: Band) => {
                                bandNames.push(band.name)
                            })
                            bandNames.forEach((bandname: string) => {
                                bandnamesString += `Musician is active in :<strong> ${bandname}</strong> <br>`
                            })
                            this.dialog.open(WarningComponent, {
                                data: {
                                    message: `Active musicians cannot be deleted<br>
                                    this musician is still active in: <br> ${bandnamesString}`
                                }
                            })
                        })

                    } else {
                        this.confirmService.getConfirmation('this will permanently delete the musician form the db')
                            .then((res: boolean) => {
                                if (res) {
                                    console.log('DELETE MUSICIAN')
                                    this.fs.deleteDoc(`musicians/${musicianId}`)
                                        .then((res: any) => {
                                            this.sb.openSnackbar(`musician ${musicianId} succesfully deleted`)
                                            this.dataSource._updateChangeSubscription();
                                            console.log(this.sort)
                                            this.dataSource.sort = this.sort;
                                        })
                                        .catch((err: FirebaseError) => {
                                            console.log(err)
                                            this.sb.openSnackbar(`operation failed due to: ${err.message}`);
                                        })
                                }
                            })
                    }
                })
        })
    }

    checkEligibility(musicianId: string) {
        this.getBandMemberIds()
    }

    getBandMemberIdsActiveBand() {
        const promise = new Promise((resolve, reject) => {
            this.fs.getFieldInDocument(`bands/${this.bandId}`, 'bandMemberIds')
                .then((bandmemberIds: string[]) => {
                    resolve(bandmemberIds)
                })
                .catch((err: FirebaseError) => {
                    console.log(err)
                    this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                })
        })
    }

    private getBandIdsMusicianActive(musicianId: string, bandIdsBandMemberIds: BandIdBandMemberId[]) {

        const bandIdsMusicianActive: string[] = []
        const promise = new Promise((resolve, reject) => {

            bandIdsBandMemberIds.forEach((bandIdsBandMemberId: BandIdBandMemberId) => {
                if (bandIdsBandMemberId.bandMemberId === musicianId) {
                    bandIdsMusicianActive.push(bandIdsBandMemberId.bandId)
                }
            })
            console.log(bandIdsMusicianActive)
            resolve(bandIdsMusicianActive)
        })
        return promise;
        // console.log(bandIdsBandMemberIds, musicianId)

        // const promise = new Promise((resolve, reject) => {

        bandIdsMusicianActive.forEach((bandId: string) => {
            this.fs.getDoc(`bands/${bandId}`)
                .pipe(take(1))
                .subscribe((band: Band) => {
                    if (band) {
                        console.log('musician active in: ', band.name)
                        // resolve(band.name)
                    } else {
                        console.log('musician not participating in any band')
                        // resolve('musician not participating in any band')
                    }

                })
        })
    }
    async getBandnamesById(bandIds: string[]) {
        const promises = bandIds.map(async (bandId) => {
            const response = await this.getBandNameById(bandId)
            return response; // Returning the parsed JSON
        });

        const results = await Promise.all(promises);
        return results
    }

    getBandNameById(bandId) {
        const promise = new Promise((resolve, rejecty) => {
            this.fs.getDoc(`bands/${bandId}`)
                .pipe(take(1))
                .subscribe((band: Band) => {
                    resolve(band)
                })
        })
        return promise

    }

    // async getBandnamesFromBandId(musicianId: string, bandIdsBandMemberIds: BandIdBandMemberId[]) {
    //     const bandIdsMusicianActive: string[] = []
    //     // console.log(bandIdsBandMemberIds, musicianId)
    //     bandIdsBandMemberIds.forEach((bandIdsBandMemberId: BandIdBandMemberId) => {
    //         if (bandIdsBandMemberId.bandMemberId === musicianId) {
    //             bandIdsMusicianActive.push(bandIdsBandMemberId.bandId)
    //         }
    //     })
    //     console.log(bandIdsMusicianActive)

    //     const promises = bandIdsBandMemberIds.map(async (bandId) => {
    //         const response = await (this.fs.getDoc(`bands/${bandId}`))
    //         return response
    //     })
    //     const results = await Promise.all(promises)
    //     console.log(results)
    // }




    private getAllBandIdsBandMemberIds() {
        const allBandIdsBandMemberIds: BandIdBandMemberId[] = []
        const promise = new Promise((resolve, rejvect) => {
            this.getAllBands()
                .then((bands: Band[]) => {
                    bands.forEach((band: Band) => {
                        if (band.bandMemberIds) {

                            band.bandMemberIds.forEach((bandMemberId: string) => {
                                // this.getBandMember(bandMemberId).then((bandMember: Musician) => {
                                // console.log('member name: ', bandMember.name)
                                // console.log('band name: ', band.name)
                                // console.log('-----')
                                // })
                                const bandIdBandMemberId: BandIdBandMemberId = {
                                    bandId: band.id,
                                    bandMemberId: bandMemberId
                                }
                                allBandIdsBandMemberIds.push(bandIdBandMemberId)
                            })


                            resolve(allBandIdsBandMemberIds);
                        }
                    })
                })
        })
        return promise
    }

    getBandMember(bandMemberId: string) {
        const promise = new Promise((resolve, reject) => {
            return this.fs.getDoc(`musicians/${bandMemberId}`)
                .pipe(take(1))
                .subscribe((musician: Musician) => {
                    resolve(musician)
                })

        })
        return promise
    }

    private getAllBands() {
        const promise = new Promise((resolve, reject) => {
            this.fs.collection(`bands`)
                .pipe(take(1))
                .subscribe((bands: Band[]) => {
                    resolve(bands)
                })
        })
        return promise
    }

    private getBandIdsMusicianIds(bandId: string) {
        const bandIdsMusicianIds: BandIdBandMemberId[] = []

        const promise = new Promise((resolve, reject) => {
            this.fs.getFieldInDocument(`bands/${bandId}`, 'bandMemberIds')
                .then((bandMemberIds: string[]) => {
                    if (bandMemberIds) {
                        bandMemberIds.forEach((bandMemberId: string) => {
                            const bandIdMusicianId: BandIdBandMemberId = {
                                bandId: bandId,
                                bandMemberId: bandMemberId
                            }
                            bandIdsMusicianIds.push(bandIdMusicianId)
                            resolve(bandIdMusicianId)
                        })
                        // console.log(bandIdsMusicianIds)
                    }
                    // console.log(bandIdsMusicianIds)
                    // resolve(bandIdsMusicianIds)
                })

        })
        return promise
    }





    populateFilter(bandmemberName: string) {
        this.dataSource.filter = bandmemberName.trim().toLowerCase();
        this.filterValue = bandmemberName
    }
    onClearFilter() {
        this.filterValue = ''
        this.dataSource.filter = null;
    }
    updatingBandmemberIds() {
        console.log('updating')
        this.updatingBandmembers = true;
    }

}
