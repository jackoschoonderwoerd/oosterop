import { EventEmitter, Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class UiService {

    bandIdSelected = new EventEmitter<string>();
    articleIdSelected = new EventEmitter<string>()

    bandsVisible = new EventEmitter<boolean>();
    articlesVisible = new EventEmitter<boolean>();

    constructor() { }
}
