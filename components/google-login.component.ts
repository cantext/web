import {Injectable, Observable, switchMap} from '@hypertype/core';
import {Component, HyperComponent} from '@hypertype/ui';
import {IGoogleUser} from "../google-api/google-api";
import {AuthGoogleApi} from "../google-api/auth.google-api";

@Injectable(true)
@Component({
    name: 'google-login',
    style: ``,
    template: (html, user, events) => html`
        ${user && user.displayName || JSON.stringify(user)}
        <button onclick="${user ? events.logout(e => e) : events.login(e => e)}">
            ${user ? 'logout' : 'login'}
        </button>
    `
})
export class GoogleLoginComponent extends HyperComponent {

    constructor(private auth: AuthGoogleApi) {
        super();
    }


    public State$: Observable<IGoogleUser> = this.auth.isSignedIn$.pipe(
        switchMap(isLoggedIn => isLoggedIn ?
            this.auth.getUser() :
            Promise.resolve(null as IGoogleUser))
    );

    public Events = {
        login: () => {
            this.auth.Login();
        },
        logout: () => {
            this.auth.Logout();

        }
    }
}