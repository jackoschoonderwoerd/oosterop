import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { ActivatedRoute, Router } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Review } from '../../../../../shared/models/review.model';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { DatePipe, } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TextEditorService } from '../../../../../services/text-editor.service';

import { QuillTextEditorComponent } from '../../../../../shared/quill-text-editor/quill-text-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';

interface ReviewFormValue {
    publishedBy: string;
    author: string;
    datePublished: string;

}

@Component({
    selector: 'app-add-review',
    imports: [

        MatButtonModule,
        MatFormFieldModule,
        MatInput,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        EditorModule,
        FormsModule,
        DatePipe,
        MatIconModule,
        QuillTextEditorComponent
    ],
    templateUrl: './add-review.component.html',
    styleUrl: './add-review.component.scss'
})
export class AddReviewComponent implements OnInit {

    fb = inject(FormBuilder);
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService)
    sb = inject(SnackbarService)
    reviewForm: FormGroup
    anouncementId: string;
    html: string = '';
    initialValue: 'hi there';
    reviews: Review[] = []
    editmode: boolean = false;
    reviewIndex: number;
    router = inject(Router);
    textEditorService = inject(TextEditorService);
    dialog = inject(MatDialog)

    ngOnInit(): void {

        this.initForm()
        this.anouncementId = this.route.snapshot.paramMap.get('anouncementId')
        this.getReviews()
            .then((reviews: Review[]) => {
                console.log(reviews)
                this.reviews = reviews
            })
    }


    initForm() {
        this.reviewForm = this.fb.group({
            publishedBy: new FormControl(null),
            datePublished: new FormControl(null),
            author: new FormControl(null),
        })
    }

    getReviews() {
        const path = `anouncements/${this.anouncementId}`
        const promise = new Promise((resolve, reject) => {
            this.fs.getFieldInDocument(path, 'reviews')
                .then((reviews: Review[]) => {
                    resolve(reviews)
                })
                .catch((err: FirebaseError) => {
                    console.log(err)
                    this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                })
        })
        return promise
    }



    onAddReview() {
        const formValue: ReviewFormValue = this.reviewForm.value;
        console.log(formValue.datePublished)
        const newReview: Review = {
            publishedBy: formValue.publishedBy,
            author: formValue.author,
            datePublished: new Date(formValue.datePublished),
            body: this.html
        }
        if (!this.editmode) {
            this.addReview(newReview)
        } else {
            this.updateReview(newReview)
        }
    }

    onEdit(review: Review, index: number) {
        console.log(review.datePublished)
        this.editmode = true;
        this.reviewIndex = index
        this.reviewForm.patchValue({
            publishedBy: review.publishedBy,
            author: review.author,
            datePublished: new Date(review.datePublished.seconds * 1000)
            // datePublished: review.datePublished
        })
        this.html = review.body;
        this.textEditorService.bodyChanged.emit(review.body);
    }

    onCancel() {
        this.router.navigate(['edit-anouncement', { anouncementId: this.anouncementId }])
    }

    addReview(review) {
        console.log(review);

        const path = `anouncements/${this.anouncementId}`
        this.fs.addElementToArray(path, 'reviews', review)
            .then((res: any) => {
                console.log(res);
                this.reviewForm.reset()
                this.html = null;
                this.initialValue = null;
                this.textEditorService.bodyChanged.emit('');

                this.getReviews()
                    .then((reviews: Review[]) => {
                        this.reviews = reviews
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err);
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to ${err.message}`)
            })
    }

    updateReview(selectedReview: Review) {
        console.log(selectedReview);

        this.reviews[this.reviewIndex] = selectedReview;
        const path = `anouncements/${this.anouncementId}`
        this.fs.updateField(path, 'reviews', this.reviews)
            .then((res: any) => {
                this.reviewForm.reset()
                this.html = null;
                this.textEditorService.bodyChanged.emit('');
                this.editmode = false;
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to ${err.message}`)
            })
    }

    onDelete(review: Review, index: number) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: review.body
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {

                const paht = `anouncements/${this.anouncementId}`
                this.fs.removeElementFromArray(paht, 'reviews', review)
                    .then((res: any) => {
                        console.log(res)
                        // this.reviews.splice(index, 1)
                        this.getReviews()
                            .then((reviews: Review[]) => {
                                this.reviews = reviews
                            })
                            .catch((err: FirebaseError) => {
                                console.log(err);
                                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                            })
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err);
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar('operation aborted by user');
            }
        })
    }
    htmlChanged(html: string) {
        this.html = html
    }

}
