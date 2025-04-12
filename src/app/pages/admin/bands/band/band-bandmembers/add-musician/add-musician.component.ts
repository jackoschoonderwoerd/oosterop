import { Component, inject, Input, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FirestoreService } from '../../../../../../services/firestore.service';
import { Musician } from '../../../../../../shared/models/musician.model';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ConfirmService } from '../../../../../../shared/confirm/confirm.service';
import { BandmembersService } from '../bandmembers.service';
import { Bandmember } from '../../../../../../shared/models/bandmemmber.model';

interface FormValue {
    name: string;
    context: string;
    instruments: string[];
}

@Component({
    selector: 'app-add-musician',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInput,
        MatIconModule,
    ],
    templateUrl: './add-musician.component.html',
    styleUrl: './add-musician.component.scss'
})
export class AddMusicianComponent implements OnInit {

    musiciansForm: FormGroup
    fb = inject(FormBuilder)
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    route = inject(ActivatedRoute)

    router = inject(Router);
    editmode: boolean = false;
    id: string;
    confirmService = inject(ConfirmService);
    musicianId: string;
    bandmemberId: string;
    musicians: Musician[];
    bMService = inject(BandmembersService)
    bandName: string;
    bandId;



    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId');
        this.getBandName(this.bandId)
        this.bMService.changingBandmember.subscribe((bandmember: Musician) => {
            if (bandmember) {
                // console.log(bandmember)
                this.onClearForm();
                this.editmode = true;
                this.musicianId = bandmember.id;
                this.bandmemberId = bandmember.id;
                this.populateMusiciansForm(bandmember);
            }
        })

        this.initForm();
        this.id = this.route.snapshot.paramMap.get('id')
        if (this.id) {
            this.musicianId = this.id;
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

    getBandName(bandId) {
        this.fs.getFieldInDocument(`bands/${bandId}`, 'name')
            .then((bandName: string) => {
                this.bandName = bandName;
            })
    }

    initForm() {
        this.musiciansForm = this.fb.group({
            name: new FormControl(null, [Validators.required]),
            instruments: new FormArray([])
        })
    }
    populateMusiciansForm(musician: Musician) {
        this.musiciansForm.patchValue({
            name: musician.name,
            context: musician.context ? musician.context : null
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

    onAddOrUpdateMusician() {
        const formValue: FormValue = this.musiciansForm.value;
        const instrumentsLowerCase = formValue.instruments.map(instrument => instrument.trim().toLowerCase());
        const bandmember: Bandmember = {
            name: formValue.name.trim().toLowerCase(),
            context: this.bandName,
            instruments: instrumentsLowerCase
        }
        if (!this.editmode) {
            // if (this.checkForExistingEntry(bandmember)) {
            this.addMusician(bandmember)
            this.bMService.musiciansChanged.emit();
            // } else {
            this.sb.openSnackbar(`operation aborted by user`);
            // }
        } else {
            this.updateMusician(bandmember)
        }

    }
    addMusician(musician: Musician) {
        const path = `musicians`
        this.fs.addDoc(path, { ...musician })
            .then((docRef: DocumentReference) => {
                // console.log(docRef.id)
                // this.musiciansForm.reset();
                this.onClearForm();
                this.bMService.musicianUpdated.emit();
                this.bMService.musiciansChanged.emit();
                this.addmusicianIdToBandmemberIds(docRef.id)
                // this.router.navigateByUrl('musicians')
            })
            .catch((err: FirebaseError) => {
                // console.log(err)
                this.sb.openSnackbar(`operation failed due to ${err.message}`)
            })
    }

    addmusicianIdToBandmemberIds(musicianId) {
        this.fs.addElementToArray(`bands/${this.bandId}`, 'bandMemberIds', musicianId)
            .then((res: any) => {
                // console.log(res)
            })
            .catch((err: FirebaseError) => {
                // console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    updateMusician(bandmember: Bandmember) {
        bandmember.id = this.bandmemberId;
        // console.log(bandmember);
        const path = `musicians/${this.bandmemberId}`
        // console.log(path)
        // return;
        this.fs.setDoc(path, bandmember)
            .then((res: any) => {
                // console.log(res);
                this.onClearForm()
                this.musiciansForm.reset();
                this.bMService.musicianUpdated.emit();
                this.bMService.musiciansChanged.emit();
                // this.router.navigateByUrl('musicians')
            })
            .catch((err: FirebaseError) => {
                // console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onClearForm() {
        this.musiciansForm.reset()
        const formArray = this.musiciansForm.get('instruments') as FormArray;
        formArray.clear();
        this.editmode = false;
    }
    onCancel() {
        this.router.navigate(['band', { bandId: this.bandId }]);
    }

    getMusicians() {
        const promise = new Promise((resolve, reject) => {
            this.fs.collection('musicians')
                .pipe(take(1))
                .subscribe((musicians: Musician[]) => {
                    resolve(musicians)
                })

        })
        return promise
    }

    checkForExistingEntry(bandMember: Bandmember) {
        // const promise = new Promise((resolve, reject) => {
        //     this.getMusicians()
        //         .then((musicians: Musician[]) => {
        //             const x = musicians.find(musician => musician.name === newMusician.name)

        //             // console.log('X:', x)
        //             if (x) {
        //                 this.confirmService.getConfirmation(
        //                     `A musician with this name already exists.
        //                     If you wish to continue,
        //                     make sure the context form field has been filled in correctly.`)
        //                     .then((res: boolean) => {
        //                         resolve(res)
        //                     })
        //             }
        //         })
        // })
        // return promise
    }
}
