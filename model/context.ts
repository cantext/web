import {ContextDbo, RelationType} from "./dbo/context.dbo";
import {GeneralTree} from "./base/tree";
import {User} from "./user";

export class Context extends GeneralTree<Context> {

    Data: ContextDbo;
    Children: Context[] = [];
    Parent: Context;
    Users: Map<User, RelationType> = new Map<User, RelationType>();
    PrevSibling: Context;
    Collapsed: boolean = false;

    public get Prev(): Context {
        return this.PrevSibling || this.Parent;
    }

    public get Next(): Context {
        return this.Children[0] || this.NextSibling || (this.Parent && this.Parent.NextSibling);
    }

    NextSibling: Context;


    constructor(dbo: ContextDbo) {
        super();
        this.Data = dbo;
    }

    public GetDbo() {
        return [
            this.Data,
            ...this.Children.map(child => child.GetDbo())
        ].distinct(dbo => dbo.Id);
    }

    public toString() {
        return this.Data.Content.map(t => t['Text']).join(' ')
    }

    public get Id() {
        return this.Data.Id;
    }

}