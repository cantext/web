import {ContextDbo, RelationType} from "./dbo/context.dbo";
import {User} from "./user";
import {Id, Path} from "./base/id";
import {ContextTree} from "./contextTree";
import {Leaf} from "./base/leaf";
import {debounceTime, mapTo, Observable, ReplaySubject, shareReplay, startWith} from "@hypertype/core";

export class Context extends Leaf<ContextDbo, Id> {

    SetText(text: any) {
        this.Value.Content[0].Text = text;
        this.tree.ChangeText$.next({
            ContextId: this.Id,
            Text: text
        });
        this.Update.next();
        if (text[text.length - 1] == '.') {
            this.Parents.forEach(parent => {
                if (parent.IsEmail)
                    this.tree.Send(parent.toString(), this.toString());
            })
        }
    }

    private get IsEmail() {
        if (this.Id == 'inbox')
            return true;
        return /^[\w\.\-\d]+@[\w\.\-\d]+\.[\w\.\-\d]+&/.test(this.Value.Content[0].Text);
    }

    Users: Map<User, RelationType> = new Map<User, RelationType>();
    protected tree: ContextTree;


    constructor(tree: ContextTree, dbo: ContextDbo) {
        super();
        this.tree = tree as any;
        this.Value = dbo;
        if (this.IsEmail) {
            this.LoadEmails();
        }
    }

    async LoadEmails() {
        const messages = await this.tree.email.Get(this.toString());
        messages
            .filter(msg => !this.Value.Children.includes(msg.id))
            .forEach(msg => {
                this.tree.Add(this, {
                    Content: [{Text: msg.snippet}],
                    Children: [],
                    Id: msg.id,
                    Time: null
                }, 0);
            })

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

    public Move(from: Path, {parent: to, index}) {
        const oldParentId = from[from.length - 1];
        const newParentId = to[to.length - 1];
        const oldParent = this.tree.Items.get(oldParentId);
        const newParent = this.tree.Items.get(newParentId);
        Object.keys(this._pathToKey).forEach(oldPath => {
            const newPath = oldPath.replace(`:${oldParentId}:`, `:${newParentId}:`);
            this._pathToKey[newPath] = this._pathToKey[oldPath];
            delete this._pathToKey[oldPath];
        });
        this._pathToKey[[...to, this.Id].join(':')] = this._pathToKey[[...from, this.Id].join(':')]
        oldParent.RemoveChild(this);
        newParent.InsertAt(this, index);
        this.Update.next();
    }


    public Update = new ReplaySubject<void>(1);
    public State$: Observable<Context> = this.Update.pipe(
        startWith(null),
        debounceTime(0),
        mapTo(this),
        // tap(console.log),
        shareReplay(1),
    );


    RemoveChild(child: this) {
        const index = this.Value.Children.indexOf(child.Id);
        super.RemoveChild(child);
        this.tree.RemoveChild$.next({
            ParentId: this.Id,
            Index: index
        });
        this.Update.next();
    }

    InsertAt(child: Context, index) {
        super.InsertAt(child as any, index);
        this.tree.AddChild$.next({
            ParentId: this.Id,
            ChildId: child.Id,
            Index: index
        });
        this.Update.next();
    }

    Focus(path: Path) {
        this.tree.Cursor.SetPath(path);
    }
}