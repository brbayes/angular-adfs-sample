import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, WebStorageStateStore, User, Profile } from 'oidc-client';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private oidcUserManager: UserManager;

    constructor() {
        // Initializes a new UserManager object
        this.oidcUserManager = new UserManager(this.getOidcUserManagerSettings());

        // Adds a notification for the end-user when their token expires.
        this.oidcUserManager.events.addUserLoaded(() =>
            this.oidcUserManager.events.addAccessTokenExpired(() =>
                alert('Your access token has expired!  Please login back in.')));
    }

    isAuthenticated(): Observable<boolean> {
        return this.getUser()
            .pipe(map((value: User | null) => value !== null && !value.expired));
    }

    login(): void {
        this.oidcUserManager.signinRedirect();
    }

    logout(): void {
        this.getUser().subscribe((user: User) => {
            const idToken = user.id_token;

            // This method will clear all items in the local storage, which may not be desired
            // for some applications.
            window.localStorage.clear();
            this.oidcUserManager.signoutRedirect({ id_token_hint: idToken });
        });
    }

    handleAuthRedirect(): Observable<User> {
        return from(this.oidcUserManager.signinRedirectCallback());
    }

    getAuthorizationHeaderValue(): Observable<string> {
        return this.getUser()
            .pipe(map((value: User | null) => `Bearer ${value.access_token || null}`));
    }

    getUserProfile(): Observable<Profile> {
        return this.getUser().pipe(map(user => user ? user.profile : null));
    }

    private getUser(): Observable<User> {
        return from(this.oidcUserManager.getUser());
    }

    private getOidcUserManagerSettings(): UserManagerSettings {
        return {
            authority: environment.authentication.authProviderUrl,
            client_id: environment.authentication.applicationId,
            redirect_uri: window.location.origin + '/auth-callback',
            post_logout_redirect_uri: window.location.origin,
            scope: 'openid email',
            response_type: 'id_token token',
            userStore: new WebStorageStateStore({ store: window.localStorage }),
            loadUserInfo: false
        };
    }
}
