import {startWith, Observable} from "@hypertype/core";

function promisify() {

}

export interface IGoogleUser {
    displayName: string;
    familyName: string;
    givenName: string;
    displayNameLastFirst: string;
}
export class GoogleApiAuth {

    private authInstance = gapi['auth2'].getAuthInstance();

    public async getUser(): Promise<IGoogleUser> {
        const {result} = await gapi.client.request({
            'path': 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names',
        });
        return  {
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
        }catch (e) {
            console.log(e);
            return  null;
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

export class GoogleApi {
    public static async Load() {
        await new Promise((resolve, reject) => {
            gapi.load('client:auth2', resolve);
        });
        await gapi.client.init({
            'apiKey': 'AIzaSyBXHHiYMNV6j3Ynv5oRgvcZ-fA4sT2xT14',
            // Your API key will be automatically added to the Discovery Document URLs.
            'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
            // clientId and scope are optional if auth is not required.
            'clientId': '851972563081-vta7ptgrctccu0f7543volp9k6kam27b.apps.googleusercontent.com',
            'scope': 'profile',
        });

        return new GoogleApiAuth();
    }

}