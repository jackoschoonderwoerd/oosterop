import { Concert } from "./concert.model";
import { Event } from "./event.model";

export interface EventGroup {
    bandName: string;
    concerts?: Concert[];
}
