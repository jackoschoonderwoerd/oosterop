import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { MatDatepickerModule, MatDateRangePicker, MatEndDate } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { FirebaseError } from '@angular/fire/app';
import { take } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';
import { FirestoreService } from '../../../../../services/firestore.service';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { TourPeriod } from '../../../../../shared/models/tour-period-model';
import { Band } from '../../../../../shared/models/band.model';

interface FormValue {
    bandName: string;
    startDate: Date | any;
    endDate: Date | any;
    visible: boolean

}

@Component({
    selector: 'app-band-tour-period',
    imports: [
        ReactiveFormsModule,
        MatDateRangePicker,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        DatePipe,
        MatInput,
        ConfirmComponent,
        MatCheckboxModule],
    templateUrl: './band-tour-periods.component.html',
    styleUrl: './band-tour-periods.component.scss'
})
export class BandTourPeriodsComponent implements OnInit {

    form: FormGroup;
    fb = inject(FormBuilder);
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    route = inject(ActivatedRoute);
    router = inject(Router);
    dialog = inject(MatDialog)
    tourPeriods: TourPeriod[] = [];

    bandId: string;
    editmode: boolean = false;
    pathToBand: string;
    bandName: string;
    activeIndex: number;



    ngOnInit(): void {
        this.initForm();
        this.bandId = this.route.snapshot.paramMap.get('bandId');
        this.pathToBand = `bands/${this.bandId}`
        this.getTourPeriods();
        this.getBandName();
        this.getBandId();
    }

    initForm() {
        this.form = this.fb.group({
            bandName: new FormControl(null, [Validators.required]),
            startDate: new FormControl(null, [Validators.required]),
            endDate: new FormControl(null, [Validators.required]),
            visible: new FormControl(true, [Validators.required])
        })
    }

    getTourPeriods() {
        this.fs.getFieldInDocument(this.pathToBand, 'tourPeriods')
            .then((tourPeriods: TourPeriod[]) => {
                if (tourPeriods) {
                    this.tourPeriods = tourPeriods
                }
            })
    }
    getBandName() {
        this.fs.getFieldInDocument(this.pathToBand, 'name')
            .then((name: string) => {
                if (name) {
                    this.bandName = name;
                    this.form.patchValue({
                        bandName: name
                    })
                }
            })
    }
    getBandId() {
        this.fs.getDoc(this.pathToBand)
            .subscribe((band: Band) => {
                if (band) {
                    console.log(band)
                }
            })
    }

    onAddOrUpdateTourPeriod() {
        console.log(this.form.value)
        const tourPeriod: TourPeriod = this.form.value
        if (!this.editmode) {
            this.addTourPeriod(tourPeriod)
        } else {
            this.updateTourPeriod(tourPeriod);
        }
    }

    addTourPeriod(tourPeriod: TourPeriod) {
        this.fs.addElementToArray(this.pathToBand, 'tourPeriods', tourPeriod)
            // this.fs.addDoc('tour-periods/', { ...tourPeriod })
            .then((res: any) => {
                console.log(res);
                this.form.patchValue({
                    startDate: null,
                    endDate: null,
                    visible: true
                });
                this.getTourPeriods();
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onEdit(index: number) {
        this.activeIndex = index;
        console.log()
        this.editmode = true;
        this.form.patchValue({
            startDate: new Date(this.tourPeriods[index].startDate.seconds * 1000),
            endDate: new Date(this.tourPeriods[index].endDate.seconds * 1000),
            visible: this.tourPeriods[index].visible
        })
        // const path = `tour-periods/${tourPeriodId}`
        // this.fs.getDoc(path)
        //     .subscribe((tourPeriod: TourPeriod) => {
        //         if (tourPeriod) {
        //             console.log(tourPeriod)
        //             this.tourPeriodForm.patchValue({
        //                 bandName: tourPeriod.bandName,
        //                 startDate: new Date(tourPeriod.startDate.seconds * 1000),
        //                 endDate: new Date(tourPeriod.endDate.seconds * 1000),
        //                 visible: tourPeriod.visible
        //             })
        //         } else {

        //         }
        //     })
    }

    onDelete(index: number) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: index
            }
        });
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                this.fs.removeElementFromArray(this.pathToBand, 'tourPeriods', this.tourPeriods[index])
                    .then((res: any) => {
                        console.log(res)
                        // this.form.patchValue({
                        //     startDate: null,
                        //     endDate: null
                        // })
                        this.getTourPeriods()
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err);
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar(`operation aborted by user`)
            }
        })
    }

    updateTourPeriod(tourPeriod: TourPeriod) {
        this.tourPeriods[this.activeIndex] = tourPeriod;
        this.fs.updateField(this.pathToBand, 'tourPeriods', this.tourPeriods)
            .then((res: any) => {
                console.log(res);
                this.getTourPeriods();
                this.form.patchValue({
                    startDate: null,
                    endDate: null,
                    visible: true
                });
                this.editmode = false
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })

    };

    onCancel() {
        this.router.navigate(['band', { bandId: this.bandId }])
    }

}
