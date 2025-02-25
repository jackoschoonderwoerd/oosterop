import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { OAudio } from '../../../../../shared/models/o-audio.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FirebaseError } from '@angular/fire/app';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
    selector: 'app-band-audio',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInput,
        MatIconModule,
        MatCheckboxModule,
        ConfirmComponent
    ],
    templateUrl: './band-audio.component.html',
    styleUrl: './band-audio.component.scss'
})
export class BandAudioComponent implements OnInit {
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    fb = inject(FormBuilder)
    bandId: string;
    path: string;
    oAudios: OAudio[] = [];
    oAudioForm: FormGroup;
    editmode: boolean = false;
    router = inject(Router);
    activeIndex: number;
    dialog = inject(MatDialog)

    ngOnInit(): void {
        this.initOAdioForm()
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        this.path = `bands/${this.bandId}`;
        this.getOAudios();

    }
    getOAudios() {
        this.fs.getFieldInDocument(this.path, 'oAudios')
            .then((oAudios: OAudio[]) => {
                this.oAudios = oAudios
            })

    }
    initOAdioForm() {
        this.oAudioForm = this.fb.group({
            title: new FormControl(null),
            comments: new FormControl(null),
            code: new FormControl(null, [Validators.required]),
            visible: new FormControl(true, [Validators.required])
        })
    }
    onAddOrEditAudio() {
        const oAudio: OAudio = this.oAudioForm.value
        if (!this.editmode) {
            this.addOAudio(oAudio)
        } else {
            this.oAudios[this.activeIndex] = oAudio
            this.updateOAudios()
        }

    }
    onEdit(index: number) {
        this.editmode = true;
        this.activeIndex = index;
        this.oAudioForm.setValue({
            ...this.oAudios[index]
        })
    }
    onDelete(index: number) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: this.oAudios[index].title
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                this.oAudios.splice(index, 1)
                this.updateOAudios()
            } else {
                this.sb.openSnackbar(`operation aborted by user`)
            }
        })
    }

    addOAudio(oAudio: OAudio) {
        this.fs.addElementToArray(this.path, 'oAudios', oAudio)
            .then((res: any) => {
                console.log(res);
                this.getOAudios();
                this.oAudioForm.reset()
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    updateOAudios() {
        this.fs.updateField(this.path, 'oAudios', this.oAudios)
            .then((res: any) => {
                console.log(res);
                this.editmode = false;
                this.oAudioForm.reset();
                this.getOAudios();
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    onCancel() {
        this.router.navigate(['band', { bandId: this.bandId }])
    }
}
