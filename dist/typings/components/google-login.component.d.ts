import { Observable } from '@hypertype/core';
import { HyperComponent } from '@hypertype/ui';
import { GoogleApiAuth, IGoogleUser } from "../entry/google-api";
export declare class GoogleLoginComponent extends HyperComponent {
    private auth;
    constructor(auth: GoogleApiAuth);
    State$: Observable<IGoogleUser>;
    Events: {
        login: () => void;
        logout: () => void;
    };
}
