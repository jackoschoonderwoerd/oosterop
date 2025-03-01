import { Concert } from "./concert.model";

export interface GroupedConcerts {
    bandName: string;
    concerts: Concert[]
}
