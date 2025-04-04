import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VisitorService {

    bandChanged = new EventEmitter<void>();
    scrollToTopContent = new EventEmitter<void>()

    constructor() { }
}
