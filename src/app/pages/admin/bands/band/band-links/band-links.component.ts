import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { Link } from '../../../../../shared/models/link.model';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FirebaseError } from '@angular/fire/app';
import { JsonPipe, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';

interface LinksFormValue {
    title: string;
    url: string
}

@Component({
    selector: 'app-band-links',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatInput,
        MatFormFieldModule,
        MatIconModule,
        ConfirmComponent
    ],
    templateUrl: './band-links.component.html',
    styleUrl: './band-links.component.scss'
})
export class BandLinksComponent implements OnInit {
    linkForm: FormGroup
    fb = inject(FormBuilder)
    route = inject(ActivatedRoute);
    router = inject(Router)
    bandId: string;
    path: string
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    links: Link[] = []
    editmode: boolean = false;
    activeIndex: number;
    dialog = inject(MatDialog)

    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId');
        this.path = `bands/${this.bandId}`
        this.getLinks()
        this.initForm()
    }
    getLinks() {
        this.fs.getFieldInDocument(this.path, 'links')
            .then((links: Link[]) => {
                this.links = links
            })
            .catch((err: FirebaseError) => {
                console.log(err),
                    this.sb.openSnackbar(`operatio failed due to: ${err.message}`)
            })
    }
    initForm() {
        this.linkForm = this.fb.group({
            title: new FormControl(null, [Validators.required]),
            url: new FormControl(null, Validators.required)
        })
    }
    onAddOrUpdateLink() {
        const link: Link = this.linkForm.value
        if (!this.editmode) {
            this.addLink(link)
        } else {
            this.updateLink(link)
        }

    }
    onEdit(index) {
        this.activeIndex = index
        this.editmode = true
        this.linkForm.setValue({
            ...this.links[index]
        })
    }

    addLink(link) {
        this.fs.addElementToArray(this.path, 'links', link)
            .then((res: any) => {
                console.log(res);
                this.getLinks()
            })
    }
    updateLink(link: Link) {
        const updatedLink: Link = this.linkForm.value;
        this.links[this.activeIndex] = link;
        this.fs.updateField(this.path, 'links', this.links)
            .then((res: any) => {
                this.getLinks()
                this.linkForm.reset();
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })

    }

    onDelete(index) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: this.links[index].title
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                this.links.splice(1, index);
                this.fs.updateField(this.path, 'links', this.links)
                    .then((res: any) => {
                        this.getLinks()
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err)
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })

            } else {
                this.sb.openSnackbar(`operation aborted by user`);
            }
        })
    }
    onCancel() {
        this.editmode = false;
        this.linkForm.reset()
        this.router.navigate(['band', { bandId: this.bandId }])
    }
    setForm(link: Link) {

    }

    // linksForm: FormGroup;

    // constructor(private fb: FormBuilder) {

    // }

    // ngOnInit(): void {
    //     this.initLinksForm()
    //     this.bandId = this.route.snapshot.paramMap.get('bandId')
    //     if (this.bandId) {
    //         this.path = `bands/${this.bandId}`
    //         this.getLinks()
    //     }
    // }
    // initLinksForm() {
    //     this.linksForm = this.fb.group({
    //         links: this.fb.array([]) // Initial empty FormArray
    //     });
    // }

    // getLinks() {
    //     this.fs.getFieldInDocument(this.path, 'links')
    //         .then((links: Link[]) => {
    //             console.log(links)
    //             this.myLinks = links

    //         })
    // }
    // onEdit(index: number) {
    //     console.log(index)
    //     console.log(this.myLinks[index])
    // }

    // // Getter for FormArray
    // get links(): FormArray {
    //     return this.linksForm.get('links') as FormArray;
    // }

    // // Function to create a new FormGroup inside FormArray
    // createLink(): FormGroup {
    //     return this.fb.group({
    //         title: ['', Validators.required],
    //         url: ['', [Validators.required, Validators.min(1)]]
    //     });
    // }

    // // Add new FormGroup to FormArray
    // addLink(): void {
    //     this.links.push(this.createLink());
    // }

    // // Remove a FormGroup from FormArray
    // removeLink(index: number): void {
    //     this.links.removeAt(index);
    // }

    // // Submit the form
    // onSubmit(): void {
    //     const links = this.linksForm.value.links;
    //     console.log(links)
    //     links.forEach((link: Link) => {
    //         this.fs.addElementToArray(this.path, 'links', link)
    //             .then((res: any) => {
    //                 console.log(res);
    //                 this.getLinks()
    //             })
    //             .catch((err: FirebaseError) => {
    //                 console.log(err)
    //                 this.sb.openSnackbar(`opertion failed due to: ${err.message}`)
    //             })
    //     })
    // }


    //  =======================



    // getLinks() {
    //     this.fs.getFieldInDocument(this.path, 'links')
    //         .then((links: Link[]) => {
    //             console.log(links)
    //             this.links = links

    //         })
    // }

    // onAddLink() {
    //     const control = new FormControl(null, [Validators.required]);
    //     (<FormArray>this.linksForm.get('links')).push(control);
    // }

    // onRemoveLink(index: number) {
    //     (<FormArray>this.linksForm.get('links')).removeAt(index)
    // }
    // onAddLinks() {

    //     console.log(this.linksForm.value)
    //     const links = this.linksForm.value.links
    //     links.forEach((link: Link) => {
    //         this.fs.addElementToArray(this.path, 'links', link)
    //             .then((res: any) => {
    //                 console.log(res);
    //                 this.getLinks
    //             })
    //             .catch((err: FirebaseError) => {
    //                 console.log(err)
    //                 this.sb.openSnackbar(`opertion failed due to: ${err.message}`)
    //             })
    //     })
    // }
}
