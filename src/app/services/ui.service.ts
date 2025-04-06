import { EventEmitter, Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class UiService {

    bandChanged = new EventEmitter<void>();

    scrollToTopContent = new EventEmitter<void>()

    bandIdSelected = new EventEmitter<string>();
    articleIdSelected = new EventEmitter<string>()

    bandsVisible = new EventEmitter<boolean>();
    articlesVisible = new EventEmitter<boolean>();

    constructor() { }
}
