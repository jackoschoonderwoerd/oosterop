import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ArrayService {

    constructor() { }

    move(array: any[], fromIndex: number, toIndex: number) {

        if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
            console.error("Index out of bounds");
            return;
        }
        const newArray = array.slice(); // Create a shallow copy of the array
        const removedElement = newArray.splice(fromIndex, 1)[0]; // Remove the element and store it
        newArray.splice(toIndex, 0, removedElement); // Insert it at the desired position

        return newArray;
    }
}

