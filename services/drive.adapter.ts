import {Injectable} from "@hypertype/core";
import {AuthGoogleApi} from "../google-api/auth.google-api";
import {DriveGoogleApi} from "../google-api/drive.google-api";
import {DefaultData} from "../model/dbo/default";
import {Id} from "../model/base/id";
import {ContextDbo} from "../model/dbo/context.dbo";
import {FileTree} from "./file.tree";
import File = gapi.client.drive.File;

@Injectable()
export class DriveAdapter {
    private files: Map<Id, File> = new Map<Id, File>();

    constructor(private fileTree: FileTree,
                private authApi: AuthGoogleApi,
                private driveApi: DriveGoogleApi) {
    }

    async init() {
        const root = await this.driveApi.GetAppFolder();
        const files = await this.driveApi.ListAppData();
        if (!files.length) {
            const dto = DefaultData();
            await this.fileTree.Load(dto);
            return;
        }
        await this.fileTree.LoadFiles(files, root.id);
    }

    async add(contexts: ContextDbo[], parents: Id[]) {
        for (const context of contexts) {
            console.log(context.Id, parents);
            const file = await this.driveApi.CreateFolder(context.toString(), parents.map(p => this.files.get(p).id));
            this.files.set(context.Id, file);
            context.Id = file.id;
        }
    }

    async Clear() {
        await this.driveApi.Delete('appDataFolder');
    }
}

