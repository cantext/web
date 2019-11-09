import Spreadsheet = gapi.client.sheets.Spreadsheet;
import Request = gapi.client.sheets.Request;

export class SheetGoogleApi {
    private api = gapi.client.sheets.spreadsheets;

    public async Create(spreadsheet: Spreadsheet) {
        const {result} = await this.api.create({
            resource: spreadsheet
        });
        return result;
    }

    async Get(id: string) {
        const {result, status} = await this.api.get({
            spreadsheetId: id,
            includeGridData: true
        });
        return result;
    }

    async Update(spreadsheetId: string, updates: Request[]) {
        await this.api.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: {
                requests: updates
            },
        })
    }

}
