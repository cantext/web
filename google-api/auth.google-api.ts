import {distinctUntilChanged, Observable, startWith} from "@hypertype/core";
import {IGoogleUser} from "./google-api";

export class AuthGoogleApi {

    private authInstance = gapi['auth2'].getAuthInstance();

    public get User(): IGoogleUser {
        const user = this.authInstance.currentUser.Ab.w3;
        return {
            givenName: user.ofa,
            familyName: user.wea,
            displayName: user.ig,
            email: user.U3
        };
    }

    public async getMessages() {
        try {
            const {result} = await gapi.client.request({
                'path': 'https://www.googleapis.com/gmail/v1/users/me/threads',
            });
            return result.threads.map(m => m.snippet);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    public async Login() {
        this.authInstance.signIn({
            scope: 'https://www.googleapis.com/auth/gmail.modify'
        });
    }

    public isSignedIn$: Observable<boolean> = new Observable(subscr => {
        this.authInstance.isSignedIn
            .listen((isLoggedIn: boolean) => {
                subscr.next(isLoggedIn)
            });
    }).pipe(
        startWith(this.authInstance.isSignedIn.get()),
        distinctUntilChanged()
    );

    Logout() {
        this.authInstance.signOut();

    }
}