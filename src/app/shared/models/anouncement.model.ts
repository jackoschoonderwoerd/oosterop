import { Artist } from "./artist.model";
import { Link } from "./link.model";
import { Musician } from "./musician.model";
import { OImage } from "./o_image.model";
import { Review } from "./review.model";

export interface Anouncement {
    id?: string;
    seqNr: number;
    visible: boolean;
    postedOn: Date | any;
    header: string;
    oImages?: OImage[];
    body?: string;
    musiciansIds?: string[];
    reviews?: Review[];
    links?: Link[];
}
