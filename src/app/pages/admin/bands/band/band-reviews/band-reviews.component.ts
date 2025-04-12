import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillTextEditorComponent } from '../../../../../shared/quill-text-editor/quill-text-editor.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Review } from '../../../../../shared/models/review.model';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { TextEditorService } from '../../../../../services/text-editor.service';
import { DatePipe } from '@angular/common';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VisibilityEyesComponent } from '../../../../../shared/visibility-eyes/visibility-eyes.component';

interface FormValue {
    publishedBy: string,
    datePublished: Date,
    author: string;
    visible: boolean;
}

@Component({
    selector: 'app-band-reviews',
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
        MatCheckboxModule,
        VisibilityEyesComponent
    ],
    templateUrl: './band-reviews.component.html',
    styleUrl: './band-reviews.component.scss'
})
export class BandReviewsComponent implements OnInit {
    route = inject(ActivatedRoute);
    router = inject(Router)
    fb = inject(FormBuilder)
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    textEditorService = inject(TextEditorService);
    reviewForm: FormGroup;
    reviews: Review[];
    bandId: string;
    path: string;
    editmode: boolean;
    body: string;
    activeIndex: number;
    dialog = inject(MatDialog);



    ngOnInit(): void {
        this.initForm()
        this.bandId = this.route.snapshot.paramMap.get('bandId');
        this.path = `bands/${this.bandId}`
        this.getReviews()
    }
    initForm() {
        this.reviewForm = this.fb.group({
            publishedBy: new FormControl(null),
            datePublished: new FormControl(null),
            author: new FormControl(null),
            visible: new FormControl(true)

        })
    }

    getReviews() {
        this.fs.getFieldInDocument(this.path, 'reviews')
            .then((reviews: Review[]) => {
                this.reviews = reviews
            })
    }

    htmlChanged(body: string) {
        this.body = body
    }

    onAddOrUpdateReview() {
        const review: Review = {
            ...this.reviewForm.value,
            body: this.body
        }
        // console.log(review)
        const arrayName = review.type
        if (!this.editmode) {
            this.addReview(review)
        } else {
            this.updateReview(review)
        }
    }

    addReview(review: Review) {

        this.fs.addElementToArray(this.path, 'reviews', review)
            .then((res: any) => {
                // console.log(res);
                this.textEditorService.passBodyToEditor('')
                this.getReviews();
                this.reviewForm.reset();
            })
            .catch((err: FirebaseError) => {
                // console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }



    onDelete(index: number) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: this.reviews[index].publishedBy
            }
        });
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                this.fs.removeElementFromArray(this.path, 'reviews', this.reviews[index])
                    .then((res: any) => {
                        // console.log(res);
                        this.getReviews();
                    })
                    .catch((err: FirebaseError) => {
                        // console.log(err)
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
        const review: Review = this.reviews[index]
        this.reviewForm.patchValue({
            publishedBy: review.publishedBy ? review.publishedBy : null,
            datePublished: review.datePublished ? new Date(review.datePublished.seconds * 1000) : null,
            author: review.author ? review.author : null,
            visible: review.visible ? review.visible : null
        })
        this.textEditorService.passBodyToEditor(review.body)
    }
    updateReview(review: Review) {
        this.reviews[this.activeIndex] = review;
        this.fs.updateField(this.path, 'reviews', this.reviews)
            .then((res: any) => {
                // console.log(res);
                this.getReviews();
                this.reviewForm.reset();
                this.textEditorService.passBodyToEditor('');
                this.editmode = false;
            })
            .catch((err: FirebaseError) => {
                // console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
    onCancel() {
        this.reviewForm.reset();
        this.textEditorService.passBodyToEditor('');
        this.editmode = false;
        this.router.navigate(['band', { bandId: this.bandId }])
    }
}
