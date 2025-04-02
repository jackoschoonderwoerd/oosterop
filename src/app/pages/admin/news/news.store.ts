
import { signalStore, patchState, withMethods, withState } from "@ngrx/signals";
import { Article } from "../../../shared/models/article-models/ariticle.model";
import { inject } from "@angular/core";
import { FirestoreService } from "../../../services/firestore.service";


type NewsState = {
    activeArticle: Article;
    toShow: string;

}
const initialState: NewsState = {
    activeArticle: null,
    toShow: 'news'

}
export const NewsStore = signalStore(

    { providedIn: 'root', protectedState: false, },
    withState(initialState),
    withMethods(
        ((store) => ({
            setArticle(article: Article) {
                console.log(article)
                if (article) {
                    patchState(store, { activeArticle: article })
                } else {
                    patchState(store, { activeArticle: null })
                }
            },
            showNewsOrBands(toShow: string) {
                if (toShow === 'bands') {
                    patchState(store, { toShow: 'bnds' })
                } else {
                    toShow === 'news'
                }
            }
        }))
    ),
)
