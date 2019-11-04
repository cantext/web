import {Observable} from "rxjs";
import {startWith} from "rxjs/operators";
import {IGoogleUser} from "./google-api";

export class AuthGoogleApi {

    private authInstance = gapi['auth2'].getAuthInstance();

    public async getUser(): Promise<IGoogleUser> {
        const {result} = await gapi.client.request({
            'path': 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names',
        });
        return {
            ...result.names[0],
            metadata: undefined
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
        startWith(this.authInstance.isSignedIn.get())
    );

    Logout() {
        this.authInstance.signOut();

    }
}