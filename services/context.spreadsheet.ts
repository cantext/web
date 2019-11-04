import {ContextTree} from "../model/contextTree";
import {ContextDbo, RelationDbo, RelationType, RootDbo, UserDbo} from "../model/dbo/context.dbo";
import {map, merge, mergeMap} from "@hypertype/core";
import Spreadsheet = gapi.client.sheets.Spreadsheet;
import Request = gapi.client.sheets.Request;
import Sheet = gapi.client.sheets.Sheet;
import RowData = gapi.client.sheets.RowData;
import {Id} from "../model/base/id";

export class ContextSpreadsheet {

    constructor(public spreadsheet: Spreadsheet,
                public tree: ContextTree) {
        this.initSheets();
        if (!this.spreadsheet.properties)
            this.spreadsheet.properties = {
                title: 'context.xls'
            }
    }

    private OnNewContext$ = this.tree.OnAdd.asObservable().pipe(
        map(ctx => [
            ...this.addContext(ctx.Value)
        ])
    );
    private Context$ = this.tree.OnAdd.asObservable().pipe(
        map(ctx => [
            ...this.addContext(ctx.Value)
        ])
    );


    private RemoveChild$ = this.tree.RemoveChild$.pipe(
        map(addChild => this.RemoveChildrenAt(addChild.ParentId,  addChild.Index))
    );
    private AddChild$ = this.tree.AddChild$.pipe(
        map(addChild => this.AddChildrenAt(addChild.ParentId, addChild.ChildId, addChild.Index))
    );
    private ChangeText$ = this.tree.ChangeText$.pipe(
        map(changeText => this.ChangeText(changeText.ContextId, changeText.Text))
    );

    private initSheets() {
        if (!this.spreadsheet.sheets)
            this.spreadsheet.sheets = [];
        this.ContextSheet = this.getOrCreateSheet('Contexts');
        this.ContentSheet = this.getOrCreateSheet('Content');
        this.UsersSheet = this.getOrCreateSheet('Users');
        this.RelationSheet = this.getOrCreateSheet('Relations');
    }

    private getOrCreateSheet(name: 'Contexts' | 'Content' | 'Users' | 'Relations') {
        return this.spreadsheet.sheets
            .find(s => s.properties.title == name) || (() => {
            const sheet: Sheet = ({
                properties: {
                    title: name
                },
                data: [{
                    rowData: [],
                }]
            });
            this.spreadsheet.sheets.push(sheet);
            return sheet;
        })()
    }

    public ContextSheet: Sheet;
    public ContentSheet: Sheet;
    public UsersSheet: Sheet;
    public RelationSheet: Sheet;

    public RemoveChildrenAt(parentId: Id, index: number) {
        const row = this.ContextSheet.data[0].rowData
            .find(rd => this.contextRowToDbo(rd).Id == parentId);
        const rowIndex = this.ContextSheet.data[0].rowData.indexOf(row);
        return [{
            "deleteRange": {
                range: {
                    "sheetId": this.ContextSheet.properties.sheetId,
                    "startRowIndex": rowIndex,
                    "endRowIndex": rowIndex + 1,
                    "startColumnIndex": 2 + index,
                    "endColumnIndex": 3 + index
                },
                shiftDimension: "COLUMNS"
            }
        }]
    }
    public AddChildrenAt(parentId: Id, childId: Id, index: number) {
        const row = this.ContextSheet.data[0].rowData
            .find(rd => this.contextRowToDbo(rd).Id == parentId);
        const rowIndex = this.ContextSheet.data[0].rowData.indexOf(row);
        return [{
            "insertRange": {
                range: {
                    "sheetId": this.ContextSheet.properties.sheetId,
                    "startRowIndex": rowIndex,
                    "endRowIndex": rowIndex + 1,
                    "startColumnIndex": 2 + index,
                    "endColumnIndex": 3 + index
                },
                shiftDimension: "COLUMNS"
            }
        }, {
            "updateCells": {
                rows: [{
                    values: [{userEnteredValue: {stringValue: childId}}]
                }],
                fields: '*',
                range: {
                    "sheetId": this.ContextSheet.properties.sheetId,
                    "startRowIndex": rowIndex,
                    "endRowIndex": rowIndex + 1,
                    "startColumnIndex": 2 + index,
                    "endColumnIndex": 3 + index
                },
            }
        }]
    }
    public ChangeText(contextId: Id, text: string) {
        const row = this.ContentSheet.data[0].rowData
            .find(rd => this.contextRowToDbo(rd).Id == contextId);
        const rowIndex = this.ContentSheet.data[0].rowData.indexOf(row);
        return [{
            "updateCells": {
                rows: [{
                    values: [{userEnteredValue: {stringValue: text}}]
                }],
                fields: '*',
                range: {
                    "sheetId": this.ContentSheet.properties.sheetId,
                    "startRowIndex": rowIndex,
                    "endRowIndex": rowIndex + 1,
                    "startColumnIndex": 1,
                    "endColumnIndex": 2
                },
            }
        }]
    }

    public addContext(context: ContextDbo): Request[] {
        const contextRowData = {
            values: [
                {userEnteredValue: {stringValue: context.Id}},
                {userEnteredValue: {stringValue: context.Time}},
                ...context.Children.map(c => ({
                    userEnteredValue: {stringValue: c}
                }))
            ]
        };
        this.ContextSheet.data[0].rowData.push(contextRowData);
        const contentRowDatas = context.Content.map(content => {
            const rowData = {
                values: [
                    {userEnteredValue: {stringValue: context.Id}},
                    {userEnteredValue: {stringValue: content.Text}},
                ]
            };
            this.ContentSheet.data[0].rowData.push(rowData);
            return rowData;
        });
        return [{
            "appendCells": {
                sheetId: this.ContextSheet.properties.sheetId,
                rows: [contextRowData],
                fields: "*"
            }
        }, {
            "appendCells": {
                sheetId: this.ContentSheet.properties.sheetId,
                rows: contentRowDatas,
                fields: "*"
            }
        }]
    }

    public addUser(user: UserDbo) {
        this.UsersSheet.data[0].rowData.push({
            values: [
                {userEnteredValue: {stringValue: user.Id}},
                {userEnteredValue: {stringValue: user.Email}},
                {userEnteredValue: {stringValue: user.Name}},
            ]
        });
    }

    public addRelation(relation: RelationDbo) {
        this.UsersSheet.data[0].rowData.push({
            values: [
                {userEnteredValue: {stringValue: relation.ContextId}},
                {userEnteredValue: {stringValue: relation.UserId}},
                {userEnteredValue: {stringValue: relation.Type}},
            ]
        });
    }

    Load(rootDbo: RootDbo) {
        rootDbo.Contexts.forEach(context => this.addContext(context));
        rootDbo.Users.forEach(user => this.addUser(user));
        rootDbo.Relations.forEach(relation => this.addRelation(relation));
    }


    GetUpdates$() {
        this.tree.Load(this.ToDbo());
        return merge(
            this.OnNewContext$,
            this.AddChild$,
            this.RemoveChild$,
            this.ChangeText$
        );
    }

    private contextRowToDbo(contextRow: RowData, contentRows: RowData[] = []) {
        const context = {
            Id: contextRow.values[0].userEnteredValue.stringValue,
            Time: contextRow.values[1] && contextRow.values[1].userEnteredValue.stringValue,
            Children: contextRow.values.slice(2).map(d => d.userEnteredValue.stringValue),
        };
        return {
            ...context,
            Content: contentRows
                .filter(d => d.values[0].userEnteredValue.stringValue == context.Id)
                .map(d => ({
                    Text: d.values[1].userEnteredValue && d.values[1].userEnteredValue.stringValue
                }))
        }
    }

    ToDbo() {
        const contexts: ContextDbo[] = this.ContextSheet.data[0].rowData
            .map(c => this.contextRowToDbo(c, this.ContentSheet.data[0].rowData));
        const users: UserDbo[] = this.UsersSheet.data[0].rowData
            .map(d => ({
                Id: d.values[0].userEnteredValue.stringValue,
                Email: d.values[1].userEnteredValue.stringValue,
                Name: d.values[2].userEnteredValue.stringValue,
            }));
        const relations: RelationDbo[] = this.RelationSheet.data[0].rowData
            .map(d => ({
                ContextId: d.values[0].userEnteredValue.stringValue,
                UserId: d.values[1].userEnteredValue.stringValue,
                Type: d.values[2].userEnteredValue.stringValue as RelationType,
            }));
        return {
            Root: contexts[0].Id,
            Contexts: contexts,
            Users: users,
            Relations: relations,
            UserState: {
                ContextsState: {}
            }
        };
    }
}