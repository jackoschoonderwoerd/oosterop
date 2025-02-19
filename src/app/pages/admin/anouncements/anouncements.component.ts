import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { Anouncement } from '../../../shared/models/anouncement.model';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe } from '@angular/common';
import { ConfirmService } from '../../../shared/confirm/confirm.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-anouncements',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInput,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        DatePipe
    ],
    templateUrl: './anouncements.component.html',
    styleUrl: './anouncements.component.scss'
})
export class AnouncementsComponent implements OnInit {
    form: FormGroup;
    fb = inject(FormBuilder);
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    router = inject(Router)
    confirmService = inject(ConfirmService)
    anouncements: Anouncement[];
    visible: boolean = false;

    ngOnInit(): void {
        const path = `anouncements`
        this.fs.collection(path).subscribe((anouncements: Anouncement[]) => {
            this.anouncements = anouncements
        })
        this.initForm()
    }
    initForm() {
        this.form = this.fb.group({
            header: new FormControl(null, [Validators.required]),
            seqNr: new FormControl(null, [Validators.required]),
            visible: new FormControl(null, [Validators.required])
        })
    }

    onAddAnouncement() {
        this.router.navigateByUrl('add-anouncement');
    }

    onSubmit() {
        const formValue = this.form.value;
        const anouncement: Anouncement = {
            header: formValue.header,
            seqNr: formValue.seqNr,
            postedOn: new Date(),
            visible: formValue.visible,
            musiciansIds: [],
            reviews: [],
            oImages: []

        }
        const path = `anouncements`
        this.fs.addDoc(path, { ...anouncement })
            .then((docRef: DocumentReference) => {
                console.log(docRef.id)
            })
            .catch((err: FirebaseError) => {
                console.log(err);
            })
    }

    onDelete(anouncementId: string) {
        this.confirmService.getConfirmation(anouncementId)
            .then((res: boolean) => {
                const path = `anouncements/${anouncementId}`
                this.fs.deleteDoc(path)
                    .then((res: any) => {
                        console.log(res)
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err);
                    })
            })
            .catch((res: boolean) => {
                this.sb.openSnackbar('aborted by user')
            })
    }
    onEdit(anouncementId: string) {
        this.router.navigate(['edit-anouncement', { anouncementId }])
    }

}
