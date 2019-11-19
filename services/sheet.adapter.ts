import {bufferTime, filter, Injectable} from "@hypertype/core";
import {ContextTree} from "../model/contextTree";
import {SheetGoogleApi} from "../google-api/sheet.google-api";
import {AuthGoogleApi} from "../google-api/auth.google-api";
import {DriveGoogleApi} from "../google-api/drive.google-api";
import {ContextSpreadsheet} from "./context.spreadsheet";
import {DefaultData} from "../model/dbo/default";
import Spreadsheet = gapi.client.sheets.Spreadsheet;

@Injectable()
export class SheetAdapter {
    constructor(private tree: ContextTree,
                private sheetApi: SheetGoogleApi,
                private authApi: AuthGoogleApi,
                private driveApi: DriveGoogleApi) {
    }

    async init() {
        const sheet = await this.getOrCreate();
        sheet.GetUpdates$().pipe(
            bufferTime(3000),
            filter(arr => arr.length > 0)
        ).subscribe(updates => {
            this.sheetApi.Update(sheet.spreadsheet.spreadsheetId, updates.flat());
        });
    }

    Clear = async () => {
        const files = await this.driveApi.List('context.xls');
        await this.driveApi.Delete(files[0].id);
        await this.init()
    };

    private async getOrCreate(): Promise<ContextSpreadsheet> {
        const files = await this.driveApi.List('context.xls');
        // await this.driveApi.Delete(files[0].id);
        // files.length = 0;
        if (!files.length) {
            const spreadsheet: Spreadsheet = {};
            const tempContextSpreadsheet = new ContextSpreadsheet(spreadsheet, this.tree);
            tempContextSpreadsheet.Load(DefaultData());
            const sheet = await this.sheetApi.Create(spreadsheet);
            files.push({id: sheet.spreadsheetId});
        }

        const sheet = await this.sheetApi.Get(files[0].id);
        return new ContextSpreadsheet(sheet, this.tree);
    }
}