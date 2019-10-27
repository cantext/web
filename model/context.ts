import {ContextDbo, RelationType} from "./dbo/context.dbo";
import {GeneralTree} from "./base/tree";
import {User} from "./user";
import {Id} from "./base/id";
import {Root} from "./root";

export class Context extends GeneralTree<Context> {

    Data: ContextDbo;
    Children: Context[] = [];
    Parent: Context;
    Users: Map<User, RelationType> = new Map<User, RelationType>();
    Collapsed: boolean = false;


    constructor(private root: Root, dbo: ContextDbo) {
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

    public get Path() {
        if (!this.Parent)
            return [this.Id];
        return [...this.Parent.Path, this.Id];
    }

    public Key: Id = Id();


    public Actions = {
        Move: {
            Left: () => {
                this.MoveLeft();
                this.root.Update.next();
            },
            Right: () => {
                this.MoveRight();
                this.root.Update.next();
            },
        }
    }
}