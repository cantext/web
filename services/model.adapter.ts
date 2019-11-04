import {SheetGoogleApi} from "../google-api/sheet.google-api";
import {DriveGoogleApi} from "../google-api/drive.google-api";
import {ContextTree} from "../model/contextTree";
import {Injectable, bufferTime, filter} from "@hypertype/core";
import {DefaultData} from "../model/dbo/default";
import {AuthGoogleApi} from "../google-api/auth.google-api";
import {ContextSpreadsheet} from "./context.spreadsheet";
import Spreadsheet = gapi.client.sheets.Spreadsheet;

@Injectable()
export class ModelAdapter {
    constructor(private tree: ContextTree,
                private sheetApi: SheetGoogleApi,
                private authApi: AuthGoogleApi,
                private driveApi: DriveGoogleApi) {
    }

    async init() {
        this.authApi.isSignedIn$.subscribe(async isSigned => {
            if (!isSigned) {
                this.tree.Load();
            } else {
                const sheet = await this.getOrCreate();
                sheet.GetUpdates$().pipe(
                    bufferTime(3000),
                    filter(arr => arr.length > 0)
                ).subscribe(updates => {
                    this.sheetApi.Update(sheet.spreadsheet.spreadsheetId, updates.flat());
                })
            }
        })
    }

    private async getOrCreate(): Promise<ContextSpreadsheet> {
        const files = await this.driveApi.List('context.xls');
        if (!files.length) {
            const spreadsheet: Spreadsheet = {};
            const tempContextSpreadsheet = new ContextSpreadsheet(spreadsheet, this.tree);
            tempContextSpreadsheet.Load(DefaultData());
            await this.sheetApi.Create(spreadsheet);
        }
        const sheet = await this.sheetApi.Get(files[0].id);
        return new ContextSpreadsheet(sheet, this.tree);
    }
}

