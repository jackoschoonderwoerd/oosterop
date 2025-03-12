import { AfterViewInit, Component, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { Musician } from '../../../../../shared/models/musician.model';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { BandmemberCheckboxComponent } from './bandmember-checkbox/bandmember-checkbox.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { BandmembersService } from './bandmembers.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddMusicianComponent } from './add-musician/add-musician.component';

@Component({
    selector: 'app-bandmembers-table',
    imports: [
        MatTableModule,
        MatFormFieldModule,
        MatInput,
        MatCheckboxModule,
        BandmemberCheckboxComponent,
        MatSortModule,
        AsyncPipe,
        JsonPipe,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatProgressSpinnerModule,
        AddMusicianComponent
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
    displayedColumns: string[] = ['name', 'edit', 'context', 'instruments', 'checkbox']
    dataSource = new MatTableDataSource();
    bandMemberIds: string[] = [];
    @ViewChildren('checkbox') checkboxes!: QueryList<MatCheckbox>;
    @ViewChild(MatSort) sort: MatSort;
    bandmembers: any[] = []
    bandId: string
    private bandmembersSubject = new BehaviorSubject<any[]>(null);
    bandmembers$: Observable<any[]> = this.bandmembersSubject.asObservable();
    private bandNameSubject = new BehaviorSubject<string>(null);
    bandName$: Observable<string> = this.bandNameSubject.asObservable();
    filterValue: string;
    updatingBandmembers: boolean = false;
    musician: Musician;






    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId');
        this.getBandName()
        // this.fs.getFieldInDocument(`bands/${this.bandId}`, 'bandMemberIds')
        //     .then((bandMemberIds: string[]) => {
        //         this.getBandmembersAsync(bandMemberIds)
        //     })
        //     .catch((err: FirebaseError) => {
        //         this.sb.openSnackbar(`operation failed due to: ${err.message}`)
        //     })

        this.getBandMemberIds().then((bandMemberIds: string[]) => {
            this.getBandmembersAsync(bandMemberIds)
        })
            .then((res: any) => {
                this.sb.openSnackbar('')
            })
            .catch((err: FirebaseError) => {
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })


        this.fs.collection(`musicians`)
            .pipe(take(1))
            .subscribe((musicians: Musician[]) => {
                this.musicians = musicians
                this.dataSource = new MatTableDataSource(musicians)
            })

        this.bMService.bandMemberIdsChanged.subscribe(() => {
            console.log('band memberIds changed')
            this.getBandMemberIds().then((bandMemberIds: string[]) => {
                this.getBandmembersAsync(bandMemberIds)
            })
                .then((res: any) => {
                    this.sb.openSnackbar('')
                })
                .catch((err: FirebaseError) => {
                    this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                })
        })
    }

    async getBandName() {
        try {
            const bandName = await this.bMService.getBandName(this.bandId);
            this.bandNameSubject.next(bandName)
        } catch (error) {
            console.log(`error getting band name:, ${error}`)
        }
        // this.bMService.getBandName(this.bandId)
    }

    async getBandmembersAsync(bandmemberIds: string[]) {
        try {
            const bandmembers = await this.bMService.getBandMembers(bandmemberIds);
            this.bandmembersSubject.next(bandmembers)
            this.updatingBandmembers = false;
        } catch (error) {
            console.error('Error fetching bandMembers:', error);
        }
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

    ngAfterViewInit(): void {
        console.log(this.checkboxes.toArray())
        setTimeout(() => {

            this.dataSource.sort = this.sort;
            // this.dataSource.sort.active = 'name'; // Default sorted column
            // this.dataSource.sort.direction = 'desc'; // Default sort direction (asc/desc)
            // this.dataSource.sort.start = 'desc'; // Ensures the default direction
        }, 1000);
    }

    applyFilter(event: Event) {
        this.filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = this.filterValue.trim().toLowerCase();
    }
    onEdit(musician: Musician) {
        console.log(musician)
        this.bMService.changingMusician.emit(musician);
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
