import { Observable } from "@hypertype/core";
export interface IGoogleUser {
    displayName: string;
    familyName: string;
    givenName: string;
    displayNameLastFirst: string;
}
export declare class GoogleApiAuth {
    private authInstance;
    getUser(): Promise<IGoogleUser>;
    getMessages(): Promise<any>;
    Login(): Promise<void>;
    isSignedIn$: Observable<boolean>;
    Logout(): void;
}
export declare class GoogleApi {
    static Load(): Promise<GoogleApiAuth>;
}
