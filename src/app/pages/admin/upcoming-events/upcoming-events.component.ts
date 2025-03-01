import { Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-upcoming-events',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInput,
        MatButtonModule,
        MatIconModule,
        NgFor,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './upcoming-events.component.html',
    styleUrl: './upcoming-events.component.scss'
})
export class UpcomingEventsComponent implements OnInit {

    userForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.userForm = this.fb.group({
            bandName: ['', Validators.required],  // User's name
            events: this.fb.array([])  // FormArray for multiple events
        });
    }

    // Getter for easy access to events FormArray
    get events(): FormArray {
        return this.userForm.get('events') as FormArray;
    }

    // Method to create a new address FormGroup
    newAddress(): FormGroup {
        return this.fb.group({
            venue: ['', Validators.required],
            url: [''],
            date: [null],
            city: [''],
            country: ['']
        });
    }

    // Add a new address to the array
    addEvent() {
        this.events.push(this.newAddress());
    }

    // Remove an address by index
    removeEvent(index: number) {
        this.events.removeAt(index);
    }

    // Submit the form
    onAddEventsGroup() {
        console.log(this.userForm.value);
    }


    // =====================

    // fs = inject(FirestoreService);
    // sb = inject(SnackbarService);
    // fb = inject(FormBuilder);
    // editmode: boolean = false;

    // form: FormGroup;

    ngOnInit(): void {
        // this.initForm();
        // this.getUpcomingEvents()
    }

    // initForm() {
    //     this.form = this.fb.group({
    //         bandName: new FormControl(null, [Validators.required]),
    //         upcomingEvents: new FormArray([])
    //     })
    // }
    // getUpcomingEvents() { }

    // onRemoveUpcomingEvent(index: number) {
    //     (<FormArray>this.form.get('upcomingEvents')).removeAt(index)
    // }
    // onAddUpcomingEvent() {
    //     const control = new FormControl(null, [Validators.required]);
    //     (<FormArray>this.form.get('upcomingEvents')).push(control);
    // }
    // onAddUpcomingEventGroup() {
    //     console.log(this.form.value)
    // }
}
