import { Discography } from "./discography.model";
import { Link } from "./link.model";
import { OImage } from "./o_image.model";
import { Review } from "./review.model";

export interface Band {
    id?: string;
    seqNr: number;
    name: string;
    bandMemberIds?: String[];
    oImages?: OImage[];
    body?: string;
    links?: Link[];
    reviews?: Review[];
    discographies?: Discography[];
}
