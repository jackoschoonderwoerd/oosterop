import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { AuthStore } from '../auth.store';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInput
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

    form: FormGroup
    fb = inject(FormBuilder)
    authStore = inject(AuthStore)

    ngOnInit(): void {
        this.initForm()
    }

    initForm() {
        this.form = this.fb.group({
            email: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required])
        })
    }
    onSubmit() {
        console.log(this.form.value)
        const formValue = this.form.value
        this.authStore.login(formValue.email, formValue.password);
    }
}
