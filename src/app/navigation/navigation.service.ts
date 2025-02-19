import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor() { }
    visitorMenuItems: string[] = ['home', 'artists', 'tour-periods', 'contact'];
    adminMenuItems: string[] = ['anouncements', 'musicians', 'bands']

    getAdminMenuItems() {
        return this.adminMenuItems;
    }
    getVisitorMenuItems() {
        return this.visitorMenuItems
    }
}
