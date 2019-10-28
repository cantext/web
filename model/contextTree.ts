import {DefaultData} from "./dbo/default";
import {Id, Path} from "./base/id";
import {Tree} from "./base/tree";
import {Context} from "./context";
import {ContextDbo, ContextState, RootDbo} from "./dbo/context.dbo";
import {User} from "./user";
import {debounceTime, map, mapTo, Observable, ReplaySubject, shareReplay} from "@hypertype/core";
import {TreeCursor} from "./base/cursor";

export class ContextTree extends Tree<Context, ContextDbo, Id> {

    Items: Map<Id, Context>;
    Root: Context;

    get Parent() {
        return null;
    }

    get Children() {
        return [this.Root];
    }

    UserMap: Map<Id, User>;
    CurrentUser: User;

    constructor(dbo: RootDbo = DefaultData()) {
        super();
        window['root'] = this;
        this.UserMap = new Map(dbo.Users.map(userDbo => [userDbo.Id, new User(userDbo)]));
        // const mainContextDbo = dbo.Contexts.find(c => c.Parents.length == 0);
        // const contextDboTree = treeMap<ContextDbo>(mainContextDbo, item => dbo.Contexts
        //     .filter(c => c.Parents.includes(item.Id)));
        // this.Root = contextDboTree.map(t => new Context(this, t));

        this.Items = new Map(dbo.Contexts
            .map(dbo => [dbo.Id, new Context(this, dbo)]));

        this.Root = this.Items.get(dbo.Root);

        this.SetParents();

        dbo.Relations.forEach(relation => {
            const context = this.Items.get(relation.ContextId);
            const user = this.UserMap.get(relation.UserId);
            user.Contexts.set(context, relation.Type);
            context.Users.set(user, relation.Type);
        });

        (Object.entries(dbo.UserState.ContextsState) as [Id, ContextState][])
            .forEach(([key, state]) => {
                const context = this.Items.get(key);
                context.Collapsed = state.Collapsed;
            });


        this.Update.next();
    }

    public Update = new ReplaySubject<void>(1);
    public State$: Observable<ContextTree> = this.Update.pipe(
        debounceTime(0),
        // tap(() => {
        //     console.log(...this.Root.flatMap(t => t.Path));
        // }),
        mapTo(this),
        shareReplay(1),
    );


    Move = {
        Left: () => {
            const id = this.Cursor.Path[this.Cursor.Path.length - 1];
            this.Items.get(id).Move(this.Cursor.Path, this.Cursor.getLeft());
            // this.MoveLeft();
        },
        Right: () => {
            const id = this.Cursor.Path[this.Cursor.Path.length - 1];
            this.Items.get(id).Move(this.Cursor.Path, this.Cursor.getRight());
        },
        Down: () => {
            const id = this.Cursor.Path[this.Cursor.Path.length - 1];
            this.Items.get(id).Move(this.Cursor.Path, this.Cursor.getBottom());
        },
        Up: () => {
            const id = this.Cursor.Path[this.Cursor.Path.length - 1];
            this.Items.get(id).Move(this.Cursor.Path, this.Cursor.getTop());
        }
    }

}


