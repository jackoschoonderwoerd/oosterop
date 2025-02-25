import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TourPeriod } from '../../../shared/models/tour-period-model';
import { MatDatepickerModule, MatDateRangePicker, MatEndDate } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { FirebaseError } from '@angular/fire/app';
import { take } from 'rxjs';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-tour-periods',
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
        MatCheckboxModule
    ],
    templateUrl: './tour-periods.component.html',
    styleUrl: './tour-periods.component.scss'
})
export class TourPeriodsComponent implements OnInit {
    tourPeriodForm: FormGroup;
    fb = inject(FormBuilder);
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    route = inject(ActivatedRoute);
    router = inject(Router);
    dialog = inject(MatDialog)
    tourPeriods: TourPeriod[];
    activeTourPeriodId: string


    editmode: boolean = false


    ngOnInit(): void {
        this.initForm();
        this.fs.sortedCollection(`tour-periods`, 'startDate', 'desc')
            .subscribe((tourPeriods: TourPeriod[]) => {
                this.tourPeriods = tourPeriods
            })

        this.getTourPeriods();
    }

    initForm() {
        this.tourPeriodForm = this.fb.group({
            bandName: new FormControl(null, [Validators.required]),
            startDate: new FormControl(null, [Validators.required]),
            endDate: new FormControl(null, [Validators.required]),
            visible: new FormControl(true, [Validators.required])
        })
    }

    getTourPeriods() {

    }

    onAddOrUpdateTourPeriod() {
        console.log(this.tourPeriodForm.value)
        const tourPeriod: TourPeriod = this.tourPeriodForm.value
        if (!this.editmode) {
            this.addTourPeriod(tourPeriod)
        } else {
            this.updateTourPeriod(tourPeriod);
        }
    }

    addTourPeriod(tourPeriod: TourPeriod) {

        this.fs.addDoc('tour-periods/', { ...tourPeriod })
            .then((res: any) => {
                console.log(res);
                this.tourPeriodForm.reset();

            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onEdit(tourPeriodId: string) {
        this.activeTourPeriodId = tourPeriodId
        this.editmode = true;
        const path = `tour-periods/${tourPeriodId}`
        this.fs.getDoc(path)
            .subscribe((tourPeriod: TourPeriod) => {
                if (tourPeriod) {
                    console.log(tourPeriod)
                    this.tourPeriodForm.patchValue({
                        bandName: tourPeriod.bandName,
                        startDate: new Date(tourPeriod.startDate.seconds * 1000),
                        endDate: new Date(tourPeriod.endDate.seconds * 1000),
                        visible: tourPeriod.visible
                    })
                } else {

                }
            })
    }

    onDelete(tourPeriodId: string) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: tourPeriodId
            }
        });
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                const path = `tour-periods/${tourPeriodId}`
                this.fs.deleteDoc(path)
                    .then((res: any) => console.log(res))
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
        const path = `tour-periods/${this.activeTourPeriodId}`
        this.fs.updateDoc(path, tourPeriod)
            .then((res: any) => {
                console.log(res)
                this.editmode = false;
                this.tourPeriodForm.reset()
            }
            )
    };

    onCancel() {

    }

}
