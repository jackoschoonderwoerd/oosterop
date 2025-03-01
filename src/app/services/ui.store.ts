
import { signalStore, patchState, withMethods, withState } from "@ngrx/signals";
import { Band } from "../shared/models/band.model";


type UiState = {
    // isLoading: boolean;
    // selectedLanguage: string;
    // showBanner: boolean;
    // imageSliderActive: boolean;
    // sidenavOpen: boolean;
    subMenuItems: string[];
    band: Band;
    bandId: string;
}
const initialState: UiState = {
    // isLoading: false,
    // selectedLanguage: 'nl',
    // showBanner: false,
    // imageSliderActive: false,
    // sidenavOpen: false,
    subMenuItems: [],
    band: null,
    bandId: null
}
export const UiStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialState),
    withMethods(
        ((store) => ({
            // startLoading() {
            //     patchState(store, { isLoading: true })
            // },
            // stopLoading() {
            //     patchState(store, { isLoading: false })
            // },
            // setSidenavOpen(open: boolean) {
            //     patchState(store, { sidenavOpen: open })
            // },
            // selectLanguage(selectedLanguage: string) {
            //     patchState(store, { selectedLanguage })
            // },
            // setShowBanner(link: string) {
            //     const modifiedLink = link.split(';')[0]
            //     const pathArray: string[] = [
            //         '/exhibitions',
            //         '/beers',
            //         '/dinner',
            //         '/drinks',
            //         '/lunch',
            //         '/snacks'
            //     ]
            //     if (pathArray.includes(modifiedLink)) {
            //         patchState(store, { showBanner: true })
            //     } else {
            //         patchState(store, { showBanner: false })
            //     }
            // },
            // setImageSliderActive(active: boolean) {
            //     patchState(store, { imageSliderActive: active })
            // },
            setBand(band: Band) {
                patchState(store, { band })
            },
            setBandId(bandId: string) {
                console.log(bandId)
                patchState(store, { bandId })
            },
            setSubMenuItems(band: Band) {
                const subMenuItems: string[] = []
                console.log(subMenuItems)
                subMenuItems.push('home')
                if (band.reviews && band.reviews.length > 0) {
                    subMenuItems.push('reviews')
                }
                if (band.galleryVideos && band.galleryVideos.length > 0) {
                    subMenuItems.push('videos')
                }
                if (band.galleryImages && band.galleryImages.length > 0) {
                    subMenuItems.push('images')
                }
                if (band.oAudios && band.oAudios.length > 0) {
                    subMenuItems.push('audio')
                }
                if (band.concerts && band.concerts.length > 0) {
                    subMenuItems.push('concerts')
                }
                console.log(subMenuItems)
                patchState(store, { subMenuItems })
            }

        }))
    ),
)
