import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { FirestoreService } from '../../../../../services/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Recording } from '../../../../../shared/models/recording.model';
import { FirebaseError } from '@angular/fire/app';

@Component({
    selector: 'app-band-recordings',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInput,
        MatIconModule,
    ],
    templateUrl: './band-recordings.component.html',
    styleUrl: './band-recordings.component.scss'
})
export class BandRecordingsComponent implements OnInit {
    sb = inject(SnackbarService);
    fs = inject(FirestoreService);
    fb = inject(FormBuilder)
    route = inject(ActivatedRoute);
    router = inject(Router);
    dialog = inject(MatDialog)
    bandId: string;
    recordingForm: FormGroup;
    recordings: Recording[];
    path: string;
    editmode: boolean = false;
    activeIndex: number

    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId');
        this.path = `bands/${this.bandId}`
        this.initForm();
        this.getRecordings();
    }
    initForm() {
        this.recordingForm = this.fb.group({
            title: new FormControl(null, [Validators.required]),
            year: new FormControl(null),
            label: new FormControl(null)
        })
    }
    getRecordings() {
        this.fs.getFieldInDocument(this.path, 'recordings')
            .then((recordings: Recording[]) => {
                this.recordings = recordings
            })
            .catch((err: FirebaseError) => {
                // console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onEdit(index: number) {
        this.editmode = true;
        this.activeIndex = index;
        this.recordingForm.setValue({
            ...this.recordings[index]
        })
    }
    onDelete(index: number) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: this.recordings[index].title
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                this.recordings.splice(index, 1)
                this.fs.updateField(this.path, 'recordings', this.recordings)
                    .then((res: any) => {
                        // console.log(res);
                        this.getRecordings()
                    })
                    .catch((err: FirebaseError) => {
                        // console.log(err)
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar(`operation aborted by user`);
            }
        })
    }

    onAddOrUpdateRecording() {
        const recording: Recording = {
            ...this.recordingForm.value
        }
        if (!this.editmode) {
            this.addRecording(recording)
        } else {
            this.updateRecording(recording)
        }
    }
    addRecording(recording: Recording) {
        this.fs.addElementToArray(this.path, 'recordings', recording)
            .then((res: any) => {
                // console.log(res)
                this.getRecordings();
                this.recordingForm.reset();
            })
            .catch((err: FirebaseError) => {
                // console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    updateRecording(recording: Recording) {
        this.recordings[this.activeIndex] = recording;
        this.fs.updateField(this.path, 'recordings', this.recordings)
            .then((res: any) => {
                // console.log(res)
                this.getRecordings();
                this.editmode = false;
                this.recordingForm.reset()
            })
            .catch((err: FirebaseError) => {
                // console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    onCancel() {
        this.editmode = false;
        this.recordingForm.reset();
        this.router.navigate(['band', { bandId: this.bandId }])
    }

}
