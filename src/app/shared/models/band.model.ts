import { Recording } from "./recording.model";
import { Link } from "./link.model";
import { OImage } from "./o_image.model";
import { Review } from "./review.model";

export interface Band {
    id?: string;
    seqNr: number;
    visible: boolean;
    name: string;
    bandMemberIds?: string[];
    oImages?: OImage[];
    body?: string;
    links?: Link[];
    reviews?: Review[];
    recordings?: Recording[];
}
