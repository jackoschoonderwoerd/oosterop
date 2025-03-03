import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Concert } from '../../../../../shared/models/concert.model';
import { IconSubmenuComponent } from '../../../../../shared/icon-submenu/icon-submenu.component';
import { FirebaseError } from '@angular/fire/app';
import { DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-band-concerts',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInput,
        MatDatepickerModule,
        MatNativeDateModule,
        IconSubmenuComponent,
        DatePipe,
        MatCheckboxModule,
        ConfirmComponent
    ],
    templateUrl: './band-concerts.component.html',
    styleUrl: './band-concerts.component.scss'
})
export class BandConcertsComponent implements OnInit {
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    fb = inject(FormBuilder)
    router = inject(Router);
    dialog = inject(MatDialog)

    concerts: Concert[]
    bandId: string;
    activeIndex: number;
    path: string;
    concertForm: FormGroup;
    editmode: boolean = false;

    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        this.path = `bands/${this.bandId}`
        this.getConcerts();
        this.initForm()
    }
    getConcerts() {
        this.fs.getFieldInDocument(this.path, 'concerts')
            .then((concerts: Concert[]) => {
                this.concerts = concerts
            })
    }
    initForm() {
        this.concertForm = this.fb.group({
            date: new FormControl(null, [Validators.required]),
            venueName: new FormControl(null),
            venueUrl: new FormControl(null),
            city: new FormControl(null),
            country: new FormControl(null),
            visible: new FormControl(true, [Validators.required])
        })
    }
    onAddOrUpdateConcert() {
        const concert: Concert = this.concertForm.value;

        if (!this.editmode) {
            this.addConcert(concert)
        } else {
            this.updateConcert(concert)
        }
    }
    addConcert(concert: Concert) {
        console.log(concert);
        // return;
        this.fs.addElementToArray(this.path, 'concerts', concert)
            .then((res: any) => {
                console.log(res);
                this.concertForm.reset()
                this.getConcerts()
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onEdit(index: number) {
        this.editmode = true;
        this.activeIndex = index;
        console.log(this.concerts[index].country)

        this.concertForm.patchValue({
            date: new Date(this.concerts[index].date.seconds * 1000),
            venueName: this.concerts[index].venueName,
            venueUrl: this.concerts[index].venueUrl ? this.concerts[index].venueUrl : null,
            city: this.concerts[index].city ? this.concerts[index].city : null,
            country: this.concerts[index].country ? this.concerts[index].country : null
        })

        // this.concertForm.setValue({
        //     ...this.concerts[index],
        //     date: new Date(this.concerts[index].date.seconds * 1000)
        // })
    }
    updateConcert(concert: Concert) {
        this.concerts[this.activeIndex] = concert;
        this.fs.updateField(this.path, 'concerts', this.concerts)
            .then((res: any) => {
                console.log(res);
                this.concertForm.reset();
                this.editmode = false;
                this.getConcerts()
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`opertation failed due to: ${err.message}`)
            })
    }
    onDelete(index) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: new Date((this.concerts[index].date.seconds) * 1000)
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                this.concerts.splice(index, 1)
                this.fs.updateField(this.path, 'concerts', this.concerts)
                    .then((res: any) => {
                        console.log(res);
                        this.getConcerts()
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err);
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar(`operation aborted by user`);
            }
        })
    }

    onCancel() {
        this.router.navigate(['band', { bandId: this.bandId }])
    }

}
