import { Band } from "../band.model";
import { Bandmember } from "../bandmemmber.model";
import { Link } from "../link.model";
import { ArticlePrimary } from "./article-primary.model";
import { OImage } from "../o_image.model";
import { ArticleHeader } from "./article-header";

export interface Article {
    header: string;
    visible: boolean;
    date: Date;

    id?: string;
    band?: Band;
    body?: string;
    bandmembers?: Bandmember[];
    oImage?: OImage;
    links?: Link[]
}
