import { Injectable } from '@angular/core';
import {
    getAuth,
    Auth,
    AuthError,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    user,
    UserCredential,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from '@angular/fire/auth';


import { signalStore, patchState, withComputed, withMethods, withState } from "@ngrx/signals";

import { inject } from "@angular/core";
import { FirebaseApp, FirebaseError } from '@angular/fire/app';

import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';



type AuthState = {
    isLoggedIn: boolean;
}
const initialState: AuthState = {
    isLoggedIn: false
}

export const AuthStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialState),
    withMethods(
        (store, auth = inject(Auth), sb = inject(SnackbarService), router = inject(Router)) => ({
            async login(email: string, password: string) {
                // console.log(email)
                // auth.setPersistence(browserLocalPersistence).then(() => {
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential: UserCredential) => {
                        sb.openSnackbar('you are successfully logged in');
                        router.navigateByUrl('/home')
                        patchState(store, { isLoggedIn: true })
                    })
                    .catch((err: AuthError) => {
                        sb.openSnackbar(`login failed due to: ${err.message}`)
                        // console.log(err.message)
                        patchState(store, { isLoggedIn: false })
                    })
            },
            logout() {
                auth.signOut().then((res: any) => {
                    sb.openSnackbar('you are succesfully logged out')

                    patchState(store, { isLoggedIn: false })
                })
                    .catch((err: FirebaseError) => {
                        sb.openSnackbar(`log out failed due to: ${err.message}`)
                    })
                patchState(store, { isLoggedIn: false })
            },
            persistLogin() {
                patchState(store, { isLoggedIn: true })
                sb.openSnackbar('login persisted')
            }
        })
    ),
)
