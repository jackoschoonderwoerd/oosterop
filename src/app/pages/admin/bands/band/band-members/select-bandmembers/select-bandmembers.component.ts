import { Component, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../../../../services/firestore.service';
import { Musician } from '../../../../../../shared/models/musician.model';
import { BehaviorSubject, take } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-select-bandmembers',
    imports: [
        AsyncPipe,
        MatExpansionModule,
        MatCheckboxModule,
        JsonPipe
    ],
    templateUrl: './select-bandmembers.component.html',
    styleUrl: './select-bandmembers.component.scss'
})
export class SelectBandmembersComponent implements OnInit {
    route = inject(ActivatedRoute)
    bandId: string;
    fs = inject(FirestoreService)
    bandMembers: Musician[];
    private musiciansSubject = new BehaviorSubject<Musician[]>(null);
    musicians$: any = this.musiciansSubject.asObservable();
    bandMemberIds: string[]
    @ViewChildren('checkboxes') checkboxes: QueryList<MatCheckbox>;

    selectedValues: any[]

    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId');
        this.getBandMemberIds()
            .then((bandMemberIds: string[]) => {
                console.log(bandMemberIds)

            })
        this.getMusicians()
    }
    getMusicians() {
        this.fs.collection('musicians')
            .pipe(take(1))
            .subscribe((musicians: Musician[]) => {
                this.musiciansSubject.next(musicians)
            })
    }

    getBandMemberIds() {
        const promise = new Promise((resolve, reject) => {
            this.fs.getFieldInDocument(`bands/${this.bandId}`, 'bandMemberIds')
                .then((bandMemberIds: string[]) => {
                    this.bandMemberIds = bandMemberIds
                    resolve(bandMemberIds)
                })
        })
        return promise
    }
    onCheckboxClicked(e, musicianId) {
        console.log(e)
        e.stopPropagation();
        console.log(musicianId)
    }
    getChecked(e: any, musicianId: string) {

        // console.log(musicianId)
        return this.bandMemberIds.includes(musicianId)
        // return true
    }

    onSubmitSelection = async () => {
        // const ids:any[] = []
        // const results = await Promise.all(ids.map(async (id) => this.getChecked(null, id)));


        const selectedValues = await Promise.all(this.checkboxes
            .filter(checkbox => checkbox.checked)
            .map(checkbox => {
                checkbox.value
                console.log(checkbox.value)
                return checkbox.value
                // this.selectedValues.push(checkbox.value)
            }))
            .then((data: any) => {
                console.log(data);
                this.selectedValues = data;

            })


    }
    getBackgroundColor(musicianId: string) {
        console.log(musicianId)
        if (this.selectedValues && this.selectedValues.includes(musicianId)) {
            return "backgroundColor: yellow"
        } else {
            return "backgroundColor: green"
        }
    }


    // onSubmitSelection() {
    //     this.selectedValues = this.checkboxes
    //         .filter(checkbox => checkbox.checked)
    //         .map(checkbox => {
    //             checkbox.value
    //             console.log(checkbox.value)
    //             this.selectedValues.push(checkbox.value)
    //             console.log(this.selectedValues)
    //         })
    // }
}
