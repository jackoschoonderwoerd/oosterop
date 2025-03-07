export interface Concert {
    date: Date | any,
    venueName: string;
    venueUrl?: string;
    city: string;
    country: string;
    visible: boolean;
    bandName?: string;
}
