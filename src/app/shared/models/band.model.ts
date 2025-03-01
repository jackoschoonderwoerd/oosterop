import { Recording } from "./recording.model";
import { Link } from "./link.model";
import { OImage } from "./o_image.model";
import { Review } from "./review.model";
import { OVideo } from "./video.model";
import { OAudio } from "./o-audio.model";
import { Concert } from "./concert.model";

export interface Band {
    id?: string;
    seqNr: number;
    visible: boolean;
    name: string;
    initiator: string;
    bandMemberIds?: string[];
    oImages?: OImage[];
    body?: string;
    links?: Link[];
    quotes?: Review[];
    recordings?: Recording[];
    reviews?: Review[];
    galleryVideos?: OVideo[];
    galleryImages?: OImage[];
    oAudios?: OAudio[];
    concerts?: Concert[];
}
