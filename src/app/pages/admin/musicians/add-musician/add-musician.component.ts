import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FirestoreService } from '../../../../services/firestore.service';
import { Musician } from '../../../../shared/models/musician.model';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ConfirmService } from '../../../../shared/confirm/confirm.service';

interface FormValue {
    name: string;
    instruments: string[];
}

@Component({
    selector: 'app-add-musician',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInput, MatIconModule],
    templateUrl: './add-musician.component.html',
    styleUrl: './add-musician.component.scss'
})
export class AddMusicianComponent implements OnInit {

    musiciansForm: FormGroup
    fb = inject(FormBuilder)
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    router = inject(Router);
    editmode: boolean = false;
    route = inject(ActivatedRoute)
    id: string;
    confirmService = inject(ConfirmService)

    ngOnInit(): void {
        this.initForm();
        this.id = this.route.snapshot.paramMap.get('id')
        if (this.id) {
            const path = `musicians/${this.id}`
            this.fs.getDoc(path).pipe(take(1))
                .subscribe((musician: Musician) => {
                    this.editmode = true;
                    if (musician) {
                        this.populateMusiciansForm(musician)
                    }
                })
        }
    }

    initForm() {
        this.musiciansForm = this.fb.group({
            name: new FormControl('jacko', [Validators.required]),
            instruments: new FormArray([])
        })
    }
    populateMusiciansForm(musician: Musician) {
        this.musiciansForm.patchValue({
            name: musician.name
        })
        musician.instruments.forEach((instrument: string) => {
            const control = new FormControl(instrument);
            (<FormArray>this.musiciansForm.get('instruments')).push(control)
        })
    }

    onRemoveInstrument(index: number) {
        this.confirmService.getConfirmation(index)
            .then((res: boolean) => {
                if (res) {
                    (<FormArray>this.musiciansForm.get('instruments')).removeAt(index)
                }
            })
            .catch((res: boolean) => {
                this.sb.openSnackbar('aborted by user')
            })


    }
    onAddInstrument() {
        const control = new FormControl(null, [Validators.required]);
        (<FormArray>this.musiciansForm.get('instruments')).push(control);
    }
    onAddMusician() {
        const formValue: FormValue = this.musiciansForm.value;
        formValue.name = formValue.name.toLowerCase();
        const instrumentsLowerCase = formValue.instruments.map(instrument => instrument.toLowerCase());


        const musician: Musician = {
            name: formValue.name,
            instruments: instrumentsLowerCase
        }
        if (!this.editmode) {
            this.addMusician(musician)
        } else {
            this.updateMusician(musician)
        }

    }
    addMusician(musician: Musician) {
        const path = `musicians`
        this.fs.addDoc(path, { ...musician })
            .then((docRef: DocumentReference) => {
                console.log(docRef.id)
                this.musiciansForm.reset();
                this.router.navigateByUrl('musicians')
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to ${err.message}`)
            })
    }
    updateMusician(musician: Musician) {
        const path = `musicians/${this.id}`
        this.fs.setDoc(path, musician)
            .then((res: any) => {
                console.log(res);
                this.router.navigateByUrl('musicians')
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

}
