import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { Review } from '../../../../../shared/models/review.model';
import { MatDialog } from '@angular/material/dialog';
import { TextEditorService } from '../../../../../services/text-editor.service';
import { FirebaseError } from '@angular/fire/app';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';
import { QuillTextEditorComponent } from '../../../../../shared/quill-text-editor/quill-text-editor.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-band-quotes',
    imports: [
        QuillTextEditorComponent,
        ConfirmComponent,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatInput,
        DatePipe,
        MatCheckboxModule
    ],
    templateUrl: './band-quotes.component.html',
    styleUrl: './band-quotes.component.scss'
})
export class BandQuotesComponent implements OnInit {
    route = inject(ActivatedRoute);
    router = inject(Router)
    fb = inject(FormBuilder)
    fs = inject(FirestoreService)
    sb = inject(SnackbarService)

    textEditorService = inject(TextEditorService)
    quoteForm: FormGroup;
    quotes: Review[]
    bandId: string;
    path: string;
    editmode: boolean;
    body: string;
    activeIndex: number;
    dialog = inject(MatDialog);


    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')
        this.path = `bands/${this.bandId}`
        this.getQuotes();
        this.initForm()
    }
    initForm() {
        this.quoteForm = this.fb.group({
            publishedBy: new FormControl(null),
            datePublished: new FormControl(null),
            author: new FormControl(null),
            visible: new FormControl(true)

        })
    }

    getQuotes() {
        this.fs.getFieldInDocument(this.path, 'quotes')
            .then((quotes: Review[]) => {
                this.quotes = quotes
            })
    }
    htmlChanged(body: string) {
        this.body = body
    }
    onAddOrUpdateQuote() {
        const quote: Review = {
            ...this.quoteForm.value,
            body: this.body
        }
        console.log(quote)

        if (!this.editmode) {
            this.addQuote(quote)
        } else {
            this.updateQuote(quote)
        }
    }
    addQuote(quote: Review) {
        console.log(this.path, quote)
        this.fs.addElementToArray(this.path, 'quotes', quote)
            .then((res: any) => {
                console.log(res);
                this.textEditorService.passBodyToEditor('')
                this.getQuotes();
                this.quoteForm.reset();
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onDelete(index: number) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: this.quotes[index].publishedBy
            }
        });
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                this.fs.removeElementFromArray(this.path, 'quotes', this.quotes[index])
                    .then((res: any) => {
                        console.log(res);
                        this.getQuotes();
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err)
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar(`operation aborted by user`)
            }

        })
    }
    onEdit(index: number) {
        this.activeIndex = index;
        this.editmode = true;
        const quote: Review = this.quotes[index]
        this.quoteForm.patchValue({
            publishedBy: quote.publishedBy ? quote.publishedBy : null,
            datePublished: quote.datePublished ? new Date(quote.datePublished.seconds * 1000) : null,
            author: quote.author ? quote.author : null,
            visible: quote.visible ? quote.visible : true
        })
        this.textEditorService.passBodyToEditor(quote.body)
    }

    updateQuote(newQuote: Review) {
        this.quotes[this.activeIndex] = newQuote;
        this.fs.updateField(this.path, 'quotes', this.quotes)
            .then((res: any) => {
                console.log(res);
                this.getQuotes();
                this.quoteForm.reset();
                this.textEditorService.passBodyToEditor('');
                this.editmode = false;
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onCancel() {
        this.quoteForm.reset();
        this.textEditorService.passBodyToEditor('');
        this.editmode = false;
        this.router.navigate(['band', { bandId: this.bandId }])
    }

}
