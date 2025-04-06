import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'login', loadComponent:
            () => import('./auth/login/login.component')
                .then(c => c.LoginComponent)
    },
    {
        path: 'home', loadComponent:
            () => import('./pages/visitor/home/home.component')
                .then(c => c.HomeComponent)
    },

    {
        path: 'select-bandmembers', loadComponent:
            () => import('./pages/admin/bands/band/band-members/select-bandmembers/select-bandmembers.component')
                .then(c => c.SelectBandmembersComponent)
    },
    {
        path: 'band-bandmembers', loadComponent:
            () => import('./pages/admin/bands/band/band-bandmembers/band-bandmembers.component')
                .then(c => c.BandBandmembersComponent)
    },


    {
        path: 'musicians', loadComponent:
            () => import('./pages/admin/musicians/musicians.component')
                .then(c => c.MusiciansComponent)
    },
    {
        path: 'add-musician', loadComponent:
            () => import('./pages/admin/bands/band/band-bandmembers/add-musician/add-musician.component')
                .then(c => c.AddMusicianComponent)
    },
    {
        path: 'bands', loadComponent:
            () => import('./pages/admin/bands/bands.component')
                .then(c => c.BandsComponent)
    },
    {
        path: 'band', loadComponent:
            () => import('./pages/admin/bands/band/band.component')
                .then(c => c.BandComponent)
    },
    {
        path: 'add-band', loadComponent:
            () => import('./pages/admin/bands/add-band/add-band.component')
                .then(c => c.AddBandComponent)
    },
    {
        path: 'band-members', loadComponent:
            () => import('./pages/admin/bands/band/band-members/band-members.component')
                .then(c => c.BandMembersComponent)
    },
    {
        path: 'band-images', loadComponent:
            () => import('./pages/admin/bands/band/band-images/band-images.component')
                .then(c => c.BandImagesComponent)
    },
    {
        path: 'band-body', loadComponent:
            () => import('./pages/admin/bands/band/band-body/band-body.component')
                .then(c => c.BandBodyComponent)
    },
    {
        path: 'band-links', loadComponent:
            () => import('./pages/admin/bands/band/band-links/band-links.component')
                .then(c => c.BandLinksComponent)
    },
    {
        path: 'band-reviews', loadComponent:
            () => import('./pages/admin/bands/band/band-reviews/band-reviews.component')
                .then(c => c.BandReviewsComponent)
    },
    {
        path: 'band-recordings', loadComponent:
            () => import('./pages/admin/bands/band/band-recordings/band-recordings.component')
                .then(c => c.BandRecordingsComponent)
    },
    {
        path: 'band-quotes', loadComponent:
            () => import('./pages/admin/bands/band/band-quotes/band-quotes.component')
                .then(c => c.BandQuotesComponent)
    },
    {
        path: 'band-audio', loadComponent:
            () => import('./pages/admin/bands/band/band-audio/band-audio.component')
                .then(c => c.BandAudioComponent)
    },
    {
        path: 'band-concerts', loadComponent:
            () => import('./pages/admin/bands/band/band-concerts/band-concerts.component')
                .then(c => c.BandConcertsComponent)
    },
    {
        path: 'band-tour-periods', loadComponent:
            () => import('./pages/admin/bands/band/band-tour-periods/band-tour-periods.component')
                .then(c => c.BandTourPeriodsComponent)
    },
    {
        path: 'news', loadComponent:
            () => import('./pages/admin/news/news.component')
                .then(c => c.NewsComponent)
    },


    {
        path: 'edit-o-image', loadComponent:
            () => import('./shared/edit-o-image/edit-o-image.component')
                .then(c => c.EditOImageComponent)
    },
    {
        path: 'visitor-band', loadComponent:
            () => import('./pages/visitor/visitor-band/visitor-band.component')
                .then(c => c.VisitorBandComponent)
    },
    {
        path: 'visitor-band-reviews', loadComponent:
            () => import('./pages/visitor/visitor-band/visitor-band-reviews/visitor-band-reviews.component')
                .then(c => c.VisitorBandReviewsComponent)
    },

    {
        path: 'visitor-concerts', loadComponent:
            () => import('./pages/visitor/visitor-band/visitor-band-concerts/visitor-band-concerts.component')
                .then(c => c.VisitorBandConcertsComponent)
    },
    {
        path: 'visitor-tour-periods', loadComponent:
            () => import('./pages/visitor/visitor-tour-periods/visitor-tour-periods.component')
                .then(c => c.VisitorTourPeriodsComponent)
    },
    {
        path: 'visitor-events', loadComponent:
            () => import('./pages/visitor/visitor-events/visitor-events.component')
                .then(c => c.VisitorEventsComponent)
    },
    {
        path: 'visitor-iframe', loadComponent:
            () => import('./pages/visitor/visitor-iframe/visitor-iframe.component')
                .then(c => c.VisitorIframeComponent)
    },
    {
        path: 'visitor-contact', loadComponent:
            () => import('./pages/visitor/visitor-contact/visitor-contact.component')
                .then(c => c.VisitorContactComponent)
    },
    {
        path: '**', redirectTo: 'home', pathMatch: 'full'
    }
];
