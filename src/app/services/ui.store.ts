
import { signalStore, patchState, withMethods, withState } from "@ngrx/signals";
import { Band } from "../shared/models/band.model";
import { Article } from "../shared/models/article-models/ariticle.model";
import { Musician } from "../shared/models/musician.model";
import { Concert } from "../shared/models/concert.model";
import { OImage } from "../shared/models/o_image.model";
import { OAudio } from "../shared/models/o-audio.model";
import { Link } from "../shared/models/link.model";
import { TourPeriod } from "../shared/models/tour-period-model";


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

    bandname: string;
    oImages: OImage[]
    bandmembers: Musician[]
    bandBody: string;
    bandOAudios: OAudio[];
    bandLinks: Link[];
    upcomingConcerts: Concert[];
    bandTourPeriods: TourPeriod[];
}


const initialState: UiState = {

    subMenuItems: [],
    showNews: true,
    band: null,
    bandId: null,
    showHidden: false,
    article: null,

    bandname: null,
    oImages: [],
    bandmembers: [],
    bandBody: null,
    bandOAudios: [],
    bandLinks: [],
    bandTourPeriods: [],
    upcomingConcerts: [],

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
                // // console.log(article)
                patchState(store, { article: article })
            },
            setBandId(bandId: string) {
                // // console.log(bandId)
                patchState(store, { bandId })
            },
            setHomeSelected(status: boolean) {
                patchState(store, { showNews: status })
            },
            setShowHidden(showHidden: boolean) {
                patchState(store, { showHidden })
            },

            setBandname(bandname: string) {
                patchState(store, { bandname })
            },
            setOImages(oImages: OImage[]) {
                patchState(store, { oImages })
            },
            setBandMembers(bandmembers: Musician[]) {
                patchState(store, { bandmembers })
            },
            setBandBody(bandBody: string) {
                patchState(store, { bandBody })
            },
            setOAudios(bandOAudios: OAudio[]) {
                patchState(store, { bandOAudios })
            },
            setBandLinks(bandLinks: Link[]) {
                console.log(bandLinks)
                patchState(store, { bandLinks })
            },
            setBandTourPeriods(bandTourPeriods: TourPeriod[]) {
                patchState(store, { bandTourPeriods })
            },
            setUpcomingConcerts(upcomingConcerts: Concert[]) {
                console.log(upcomingConcerts);
                patchState(store, { upcomingConcerts })
            },

        }))
    ),
)
