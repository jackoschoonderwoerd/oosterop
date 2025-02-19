import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FirestoreService } from '../../../../services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { Anouncement } from '../../../../shared/models/anouncement.model';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar.service';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { Musician } from '../../../../shared/models/musician.model';

import { TextEditorService } from '../../../../services/text-editor.service';

@Component({
    selector: 'app-add-anouncement',
    imports: [

        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInput,
        MatIconModule,
        MatCheckboxModule,
        MatMenuModule,

    ],
    templateUrl: './add-anouncement.component.html',
    styleUrl: './add-anouncement.component.scss'
})
export class AddAnouncementComponent implements OnInit {

    primaryDataForm: FormGroup;
    fb = inject(FormBuilder);
    message: string = '';
    fs = inject(FirestoreService);
    anouncement: Anouncement;
    route = inject(ActivatedRoute);
    router = inject(Router)
    anouncementId: string;
    sb = inject(SnackbarService);
    musicians: Musician[] = [];
    html: string;
    textEditorService = inject(TextEditorService)
    editmode: boolean = false

    @Output() body = new EventEmitter<string>



    ngOnInit(): void {
        this.initPrimaryDataForm()
        this.anouncementId = this.route.snapshot.paramMap.get('anouncementId')

        if (this.anouncementId) {
            this.editmode = true;
            const path = `anouncements/${this.anouncementId}`
            this.fs.getDoc(path).subscribe((anouncement: Anouncement) => {
                this.anouncement = anouncement;
                this.patchPrimaryDataForm(this.anouncement);




            })
        } else {
            // this.router.navigateByUrl('anouncements')
            // this.sb.openSnackbar('anouncemet not found');
        }
    }


    initPrimaryDataForm() {
        this.primaryDataForm = this.fb.group({
            id: new FormControl(null, [Validators.required]),
            seqNr: new FormControl(null, [Validators.required]),
            header: new FormControl(null, [Validators.required]),
            postedOn: new FormControl(null, [Validators.required]),
            visible: new FormControl(null, Validators.required)
        })
    }
    patchPrimaryDataForm(anouncement: Anouncement) {
        this.primaryDataForm.setValue({
            id: anouncement.id,
            seqNr: anouncement.seqNr,
            header: anouncement.header,
            postedOn: anouncement.postedOn,
            visible: anouncement.visible
        })
    }
    onAddOrUpdatePrimaryData() {

        const anouncement: Anouncement = this.primaryDataForm.value;
        if (!this.editmode) {
            this.addAnouncement(anouncement)
        } else {
            this.updateAnouncement(anouncement)
        }
    }

    addAnouncement(anouncement: Anouncement) {
        const path = `anoucements`
        this.fs.addDoc(path, anouncement)
            .then((docRef: DocumentReference) => {
                console.log(docRef)
                this.sb.openSnackbar('primary data updated')
                this.router.navigateByUrl('anouncements')
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to ${err.message}`)
            })
    }
    updateAnouncement(anouncement: Anouncement) {
        const path = `anouncements/${this.anouncementId}`
        this.fs.updateDoc(path, anouncement)
            .then((res: any) => {
                console.log(res)
                this.sb.openSnackbar('primary data updated')
                this.router.navigateByUrl('anouncements')
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to ${err.message}`)
            })
    }
    onCancel() {
        this.router.navigateByUrl('anouncements')
    }
}
