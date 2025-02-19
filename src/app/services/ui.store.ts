
import { signalStore, patchState, withMethods, withState } from "@ngrx/signals";


type UiState = {
    isLoading: boolean;
    selectedLanguage: string;
    showBanner: boolean;
    imageSliderActive: boolean;
    sidenavOpen: boolean;
}
const initialState: UiState = {
    isLoading: false,
    selectedLanguage: 'nl',
    showBanner: false,
    imageSliderActive: false,
    sidenavOpen: false
}
export const UiStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialState),
    withMethods(
        ((store) => ({
            startLoading() {
                patchState(store, { isLoading: true })
            },
            stopLoading() {
                patchState(store, { isLoading: false })
            },
            setSidenavOpen(open: boolean) {
                patchState(store, { sidenavOpen: open })
            },
            selectLanguage(selectedLanguage: string) {
                patchState(store, { selectedLanguage })
            },
            setShowBanner(link: string) {
                const modifiedLink = link.split(';')[0]
                const pathArray: string[] = [
                    '/exhibitions',
                    '/beers',
                    '/dinner',
                    '/drinks',
                    '/lunch',
                    '/snacks'
                ]
                if (pathArray.includes(modifiedLink)) {
                    patchState(store, { showBanner: true })
                } else {
                    patchState(store, { showBanner: false })
                }
            },
            setImageSliderActive(active: boolean) {
                patchState(store, { imageSliderActive: active })
            }
        }))
    ),
)
