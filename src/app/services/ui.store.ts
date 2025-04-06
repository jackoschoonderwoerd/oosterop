
import { signalStore, patchState, withMethods, withState } from "@ngrx/signals";
import { Band } from "../shared/models/band.model";
import { Article } from "../shared/models/article-models/ariticle.model";


type UiState = {
    // isLoading: boolean;
    // selectedLanguage: string;
    // showBanner: boolean;
    // imageSliderActive: boolean;
    // sidenavOpen: boolean;
    subMenuItems: string[];
    band: Band;
    bandId: string;
    showHidden: boolean;
    article: Article;
    showNews: boolean;
}


const initialState: UiState = {

    subMenuItems: [],
    band: null,
    bandId: null,
    showHidden: false,
    article: null,
    showNews: true

}
export const UiStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialState),
    withMethods(
        ((store) => ({
            setBand(band: Band) {
                patchState(store, { band })
            },
            setArticle(article: Article) {
                // console.log(article)
                patchState(store, { article: article })
            },
            setBandId(bandId: string) {
                // console.log(bandId)
                patchState(store, { bandId })
            },
            setHomeSelected(status: boolean) {
                patchState(store, { showNews: status })
            },
            setShowHidden(showHidden: boolean) {
                patchState(store, { showHidden })
            }

        }))
    ),
)
