import {ContextDbo, RelationType} from "./dbo/context.dbo";
import {User} from "./user";
import {Id, Path} from "./base/id";
import {ContextTree} from "./contextTree";
import {Leaf} from "./base/leaf";
import {Observable, ReplaySubject} from "rxjs";
import {debounceTime, mapTo, shareReplay, startWith} from "@hypertype/core";

export class Context extends Leaf<ContextDbo, Id> {

    Users: Map<User, RelationType> = new Map<User, RelationType>();
    Collapsed: boolean = false;
    protected tree: ContextTree;


    constructor(tree: ContextTree, dbo: ContextDbo) {
        super();
        this.tree = tree as any;
        this.Value = dbo;
    }

    public GetDbo() {
        return [
            this.Value,
            ...this.Children.map(child => child.GetDbo())
        ].distinct(dbo => dbo.Id);
    }

    public toString() {
        return this.Value.Content.map(t => t['Text']).join(' ')
    }

    public get Id() {
        return this.Value.Id;
    }

    // public get Path() {
    //     if (!this.Parent)
    //         return [this.Id];
    //     return [...this.Parent.Path, this.Id];
    // }


    private _pathToKey = {};

    public getKey(path: Path) {
        const str = path.join(':');
        if (!this._pathToKey[str])
            this._pathToKey[str] = Id();
        return this._pathToKey[str];
    }

    public Move(from: Path, to: Path) {
        const oldParentId = from[from.length - 2];
        const [newParentId, after] = to.slice(-2);
        const oldParent = this.tree.Items.get(oldParentId);
        const newParent = this.tree.Items.get(newParentId);
        oldParent.RemoveChild(this);
        const newIndex = newParent.Value.Children.indexOf(after) || 0;
        newParent.InsertAt(this, newIndex);
        newParent.Update.next();
        oldParent.Update.next();
    }


    public Update = new ReplaySubject<void>(1);
    public State$: Observable<Context> = this.Update.pipe(
        startWith(null),
        debounceTime(0),
        mapTo(this),
        shareReplay(1),
    );
}