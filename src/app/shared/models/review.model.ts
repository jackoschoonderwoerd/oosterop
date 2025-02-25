export interface Review {
    body: string;
    publishedBy?: string;
    visible: boolean;
    type: 'quote' | 'review'
    datePublished?: Date | any;
    author?: string;
}
