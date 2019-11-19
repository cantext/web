import {ContextTree} from "../model/contextTree";
import {Injectable} from "@hypertype/core";
import {AuthGoogleApi} from "../google-api/auth.google-api";
import {DriveAdapter} from "./drive.adapter";

@Injectable()
export class ModelAdapter {
    constructor(private tree: ContextTree,
                private authApi: AuthGoogleApi,
                private adapter: DriveAdapter) {
    }

    async init() {
        this.authApi.isSignedIn$.subscribe(async isSigned => {
            if (!isSigned) {
                this.tree.Load();
            } else {
                await this.adapter.init();
            }
        })
    }

    Clear = async () => {
        await this.adapter.Clear();
    }

}

