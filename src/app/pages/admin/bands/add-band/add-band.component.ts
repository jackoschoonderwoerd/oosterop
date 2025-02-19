import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FirestoreService } from '../../../../services/firestore.service';
import { Band } from '../../../../shared/models/band.model';
import { SnackbarService } from '../../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';

interface FormValue {
    seqNr: number;
    name: string;
}

@Component({
    selector: 'app-add-band',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInput
    ],
    templateUrl: './add-band.component.html',
    styleUrl: './add-band.component.scss'
})
export class AddBandComponent implements OnInit {
    route = inject(ActivatedRoute)
    bandId: string;
    fb = inject(FormBuilder)
    bandForm: FormGroup;
    fs = inject(FirestoreService);
    bands: Band[] = [];
    sb = inject(SnackbarService);
    router = inject(Router);
    editmode: boolean = false;

    ngOnInit(): void {
        this.initBandForm();
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        if (this.bandId) {
            this.editmode = true
            const path = `bands/${this.bandId}`
            this.fs.getDoc(path)
                .subscribe((band: Band) => {
                    this.patchForm(band)

                })
        }

    }


    initBandForm() {
        this.bandForm = this.fb.group({
            seqNr: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required])
        })
    }

    patchForm(band: Band) {
        this.bandForm.patchValue({
            ...band
        })
    }

    onAddOrUpdateBand() {
        const formValue: FormValue = this.bandForm.value
        const band: Band = {
            ...formValue
        }
        if (!this.editmode) {
            this.addBand(band)
        } else {
            this.updateBand(band)
        }

    }

    addBand(band: Band) {
        const path = `bands`
        this.fs.addDoc(path, band)
            .then((res: any) => {
                console.log(res);
                this.onCancel()
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    updateBand(band: Band) {
        const path = `bands/${this.bandId}`
        this.fs.updateField(path, 'name', band.name)
            .then((res: any) => console.log(res))
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
            .then(() => {
                return this.fs.updateField(path, 'seqNr', band.seqNr)
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
            .then(() => {
                this.router.navigateByUrl('bands')
            })
    }


    onCancel() {
        this.bandForm.reset();
        if (this.editmode) {
            this.router.navigate(['band', { bandId: this.bandId }]);
        } else {
            this.router.navigateByUrl('bands')
        }
    }
}
