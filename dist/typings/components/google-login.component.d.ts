import { Observable } from '@hypertype/core';
import { HyperComponent } from '@hypertype/ui';
import { IGoogleUser } from "../google-api/google-api";
import { AuthGoogleApi } from "../google-api/auth.google-api";
export declare class GoogleLoginComponent extends HyperComponent {
    private auth;
    constructor(auth: AuthGoogleApi);
    State$: Observable<IGoogleUser>;
    Events: {
        login: () => void;
        logout: () => void;
    };
}
