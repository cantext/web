function promisify() {

}

export interface IGoogleUser {
    displayName: string;
    familyName: string;
    givenName: string;
    displayNameLastFirst: string;
}


export class GoogleApi {
    private static DISCOVERY_DOCS = [
        'https://people.googleapis.com/$discovery/rest',
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        "https://sheets.googleapis.com/$discovery/rest?version=v4"
    ];

    private static SCOPES = '' +
        'https://www.googleapis.com/auth/drive ' +
        'profile ' +
        'https://www.googleapis.com/auth/spreadsheets ';
    public static async Load() {
        await new Promise((resolve, reject) => {
            gapi.load('client:auth2', resolve);
        });
        await gapi.client.init({
            'apiKey': 'AIzaSyBXHHiYMNV6j3Ynv5oRgvcZ-fA4sT2xT14',
            // Your API key will be automatically added to the Discovery Document URLs.
            'discoveryDocs': this.DISCOVERY_DOCS,
            // clientId and scope are optional if auth is not required.
            'clientId': '851972563081-vta7ptgrctccu0f7543volp9k6kam27b.apps.googleusercontent.com',
            'scope': this.SCOPES,
        });
    }

}