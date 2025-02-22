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
import { DocumentReference } from '@angular/fire/firestore';
import { MatCheckboxModule } from '@angular/material/checkbox';


interface FormValue {
    seqNr: number;
    name: string;
    visible: boolean
}

@Component({
    selector: 'app-add-band',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInput,
        MatCheckboxModule
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
            name: new FormControl(null, [Validators.required]),
            visible: new FormControl(true, [Validators.required])
        })
    }

    patchForm(band: Band) {
        this.bandForm.patchValue({
            ...band,
            visible: band.visible ? band.visible : true
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
            .then((docRef: DocumentReference) => {
                console.log(docRef.id);
                // const bandMenuItem: BandMenuItem = {
                //     name: band.name,
                //     id: docRef.id
                // }
                // this.addBandMenuItems(bandMenuItem)
                this.onCancel();
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
                this.sb.openSnackbar(`operation failed due to: ${err.message}`);
            })
            .then(() => {
                return this.fs.updateField(path, 'seqNr', band.seqNr);
            })
            .then(() => {
                return this.fs.updateField(path, 'visible', band.visible);
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
            .then(() => {
                this.router.navigateByUrl('bands');
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
    // addBandMenuItems(bandMenuItem: BandMenuItem) {
    //     const path = `bandMenuItems`;
    //     this.fs.addDoc(path, bandMenuItem)
    //         .then((docRef: DocumentReference) => {
    //             console.log(docRef.id)
    //         })
    //         .catch((err: FirebaseError) => {
    //             console.log(err);
    //             this.sb.openSnackbar(`operation failed due to: ${err.message}`)
    //         })
    // }
}
