import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TextEditorService {

    @Output() bodyChanged = new EventEmitter<string>

    constructor() { }

    passBodyToEditor(body) {
        // // console.log('text editor service')
        this.bodyChanged.emit(body);
    }

}
