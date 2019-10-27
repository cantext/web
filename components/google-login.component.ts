import {Injectable, Observable, switchMap} from '@hypertype/core';
import {Component, HyperComponent} from '@hypertype/ui';
import {GoogleApiAuth, IGoogleUser} from "../entry/google-api";

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

    constructor(private auth: GoogleApiAuth) {
        super();
    }


    public State$: Observable<IGoogleUser> = this.auth.isSignedIn$.pipe(
        switchMap(isLoggedIn => isLoggedIn ?
            this.auth.getMessages() :
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