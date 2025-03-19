import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../../../../../services/firestore.service';
import { SnackbarService } from '../../../../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { BandmembersService } from '../../bandmembers.service';


@Component({
    selector: 'app-bandmember-checkbox',
    imports: [MatCheckbox],
    templateUrl: './bandmember-checkbox.component.html',
    styleUrl: './bandmember-checkbox.component.scss'
})
export class BandmemberCheckboxComponent implements OnInit {

    @Input() public musicianId: string;
    @Output() public updatingBandmemberIds = new EventEmitter<void>

    route = inject(ActivatedRoute)
    fs = inject(FirestoreService);
    sb = inject(SnackbarService)
    bMService = inject(BandmembersService)
    bandId: string;
    checked: boolean = false;
    bandmemberIndex: number;



    ngOnInit(): void {
        this.bandId = this.route.snapshot.paramMap.get('bandId')

        this.fs.getFieldInDocument(`bands/${this.bandId}`, 'bandMemberIds')
            .then((bandMemberIds: string[]) => {
                // console.log(bandMemberIds)
                this.bandmemberIndex = bandMemberIds.findIndex(((bandmemberId: string) => {
                    return bandmemberId === this.musicianId
                }))
                if (this.bandmemberIndex >= 0) {
                    this.checked = true
                }
            })
    }
    onCheckboxChange(e: MatCheckboxChange) {
        this.updatingBandmemberIds.emit()
        console.log(e);
        console.log(e.checked)
        if (e.checked) {
            console.log('add')
            this.addIdToBandmemberIds();
            this.bMService.bandMemberIdsChanged.emit();

        } else {
            console.log('remove')
            this.removeIdFromBandmemberIds();
            this.bMService.bandMemberIdsChanged.emit();
        }
    }

    addIdToBandmemberIds() {
        this.fs.addElementToArray(`bands/${this.bandId}`, 'bandMemberIds', this.musicianId)
            .then((res: any) => {
                this.sb.openSnackbar(`musicianId added to bandMemberIds`)
                this.bMService.bandMemberIdsChanged.emit();
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    removeIdFromBandmemberIds() {
        this.fs.removeElementFromArray(`bands/${this.bandId}`, 'bandMemberIds', this.musicianId)
            .then((res: any) => {
                this.sb.openSnackbar(`musicianId removed from bandMemberIds`)
                this.bMService.bandMemberIdsChanged.emit();
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

}
