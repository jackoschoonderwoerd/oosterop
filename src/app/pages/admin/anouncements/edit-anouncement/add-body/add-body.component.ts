import { Component, inject, OnInit } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';

import { TextEditorService } from '../../../../../services/text-editor.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';

import { QuillTextEditorComponent } from '../../../../../shared/quill-text-editor/quill-text-editor.component';

@Component({
    selector: 'app-add-body',
    imports: [

        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInput,
        MatIconModule,
        JsonPipe,
        QuillTextEditorComponent
    ],
    templateUrl: './add-body.component.html',
    styleUrl: './add-body.component.scss'
})
export class AddBodyComponent implements OnInit {
    route = inject(ActivatedRoute);
    anouncementId: string;
    editmode: boolean = false;
    fs = inject(FirestoreService)
    body: string
    router = inject(Router);
    textEditorService = inject(TextEditorService);
    sb = inject(SnackbarService)

    ngOnInit(): void {
        this.anouncementId = this.route.snapshot.paramMap.get('anouncementId');
        console.log(this.anouncementId)
        if (this.anouncementId) {
            this.editmode = true;
            this.getBody()
        }
    }

    getBody() {
        const path = `anouncements/${this.anouncementId}`;
        this.fs.getFieldInDocument(path, 'body')
            .then((body: string) => {
                this.setContent(body)
            })
    }
    setContent(body) {
        this.textEditorService.passBodyToEditor(body)
    }

    htmlChanged(body: string) {
        console.log(body)
        this.body = body;
    }

    onUpdateBody() {
        const path = `anouncements/${this.anouncementId}`;
        this.fs.updateField(path, 'body', this.body)
            .then((res: any) => {
                console.log(res);
                this.onCancel();
                this.anouncementId = null
                this.textEditorService.bodyChanged.emit('')
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onCancel() {
        this.router.navigate(['edit-anouncement', { anouncementId: this.anouncementId }])
    }
}
