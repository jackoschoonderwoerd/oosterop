import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Link } from '../models/link.model';

@Component({
    selector: 'app-add-link',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInput,

    ],
    templateUrl: './add-link.component.html',
    styleUrl: './add-link.component.scss'
})
export class AddLinkComponent implements OnInit {
    form: FormGroup;
    fb = inject(FormBuilder)

    @Output() linkReady = new EventEmitter<Link>()

    ngOnInit(): void {
        this.initForm()
    }

    initForm() {
        this.form = this.fb.group({
            title: new FormControl(null, [Validators.required]),
            url: new FormControl(null, [Validators.required])
        })
    }

    onSubmit() {
        const formValue = this.form.value;
        const link: Link = {
            title: formValue.title,
            url: formValue.url
        }
        this.linkReady.emit(link)
    }
}
