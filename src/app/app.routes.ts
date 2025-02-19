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
        path: 'anouncements', loadComponent:
            () => import('./pages/admin/anouncements/anouncements.component')
                .then(c => c.AnouncementsComponent)
    },
    {
        path: 'add-anouncement', loadComponent:
            () => import('./pages/admin/anouncements/add-anouncement/add-anouncement.component')
                .then(c => c.AddAnouncementComponent)
    },
    {
        path: 'edit-anouncement', loadComponent:
            () => import('./pages/admin/anouncements/edit-anouncement/edit-anouncement.component')
                .then(c => c.EditAnouncementComponent)
    },
    {
        path: 'add-body', loadComponent:
            () => import('./pages/admin/anouncements/edit-anouncement/add-body/add-body.component')
                .then(c => c.AddBodyComponent)
    },
    {
        path: 'add-participants', loadComponent:
            () => import('./pages/admin/anouncements/edit-anouncement/add-participants/add-participants.component')
                .then(c => c.AddParticipantsComponent)
    },
    {
        path: 'add-review', loadComponent:
            () => import('./pages/admin/anouncements/edit-anouncement/add-review/add-review.component')
                .then(c => c.AddReviewComponent)
    },
    {
        path: 'add-images', loadComponent:
            () => import('./pages/admin/anouncements/edit-anouncement/add-images/add-images.component')
                .then(c => c.AddImagesComponent)
    },
    {
        path: 'musicians', loadComponent:
            () => import('./pages/admin/musicians/musicians.component')
                .then(c => c.MusiciansComponent)
    },
    {
        path: 'add-musician', loadComponent:
            () => import('./pages/admin/musicians/add-musician/add-musician.component')
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
        path: 'edit-o-image', loadComponent:
            () => import('./shared/edit-o-image/edit-o-image.component')
                .then(c => c.EditOImageComponent)
    },
    {
        path: '**', redirectTo: 'home', pathMatch: 'full'
    }
];
