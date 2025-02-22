import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { QuillTextEditorComponent } from '../../../../../shared/quill-text-editor/quill-text-editor.component';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { TextEditorService } from '../../../../../services/text-editor.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-band-body',
    imports: [QuillTextEditorComponent, MatButtonModule],
    templateUrl: './band-body.component.html',
    styleUrl: './band-body.component.scss'
})
export class BandBodyComponent implements OnInit {
    route = inject(ActivatedRoute)
    bandId: string;
    body: string;
    fs = inject(FirestoreService)
    path: string;
    sb = inject(SnackbarService);
    initialHtml: string;
    editmode: boolean = false;
    textEditorService = inject(TextEditorService);
    router = inject(Router)

    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        if (this.bandId) {
            this.editmode = true;
            this.path = `bands/${this.bandId}`
            this.getBody()
        }
    }

    getBody() {
        this.fs.getFieldInDocument(this.path, 'body')
            .then((body: string) => {
                this.setContent(body)
            })
    }
    setContent(body) {
        this.textEditorService.passBodyToEditor(body)
    }

    htmlChanged(body: string) {
        console.log(body)
        this.body = body
    }
    onUpdateBody() {
        this.fs.updateField(this.path, 'body', this.body)
            .then((res: any) => {
                console.log(res);
                this.onCancel()
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onCancel() {
        this.router.navigate(['band', { bandId: this.bandId }])
    }
}
