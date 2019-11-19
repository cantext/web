import {DefaultData} from "./dbo/default";
import {Id} from "./base/id";
import {Tree} from "./base/tree";
import {Context} from "./context";
import {ContextDbo, ContextState, RootDbo} from "./dbo/context.dbo";
import {User} from "./user";
import {debounceTime, Injectable, mapTo, Observable, ReplaySubject, shareReplay, utc} from "@hypertype/core";
import {EmailGoogleApi} from "../google-api/email.google-api";
import {AuthGoogleApi} from "../google-api/auth.google-api";


class LocalStorage {
    public static Add = (target, key, desc) => {

    }
}
@Injectable()
export class ContextTree extends Tree<Context, ContextDbo, Id> {

    constructor(public email: EmailGoogleApi) {
        super();
        window['root'] = this;

    }

    public async Send(to: string, content: string){
        await this.email.Send(to, content);
    }

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

    public Load(dbo?: RootDbo) {
        if (!dbo){
            this.Root = null;
            this.UserMap = new Map();
            this.Items = new Map();
            this.Update.next();
            return;
        }
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

        if (this.Items.get('inbox')) {
            const inbox = this.Items.get('inbox');
            inbox.SetText(`Inbox (${this.email.me})`);
            // inbox.LoadEmails();
        }
        this.Update.next();
    }

    public ToDbo(): RootDbo{
        return  {
            Root: this.Root.Id,
            Contexts: Array.from(this.Items.values())
                .map(ctx => ctx.Value),
            Users: Array.from(this.UserMap.values())
                .map(user => user.Data),
            Relations: Array.from(this.Items.values())
                .map(ctx => [...ctx.Users.entries()].map(([user, type]) => ({
                    ContextId: ctx.Id,
                    UserId: user.Data.Id,
                    Type: type
                })))
                .flat(),
            UserState: {
                ContextsState: {}
            }
        }
    }

    public Update = new ReplaySubject<void>(1);
    public OnAdd = new ReplaySubject<Context>(1);
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
            const target = this.Cursor.getLeftMove();
            if (!target)
                return;
            this.Items.get(id).Move(this.Cursor.Path.slice(0, -1), target);
            this.Cursor.SetPath([...target.parent, id]);
        },
        Right: () => {
            const id = this.Cursor.Path[this.Cursor.Path.length - 1];
            const target = this.Cursor.getRightMove();
            if (!target)
                return;
            this.Items.get(id).Move(this.Cursor.Path.slice(0, -1), target);
            this.Cursor.SetPath([...target.parent, id]);
        },
        Down: () => {
            const id = this.Cursor.Path[this.Cursor.Path.length - 1];
            const target = this.Cursor.getBottomMove();
            if (!target)
                return;
            this.Items.get(id).Move(this.Cursor.Path.slice(0, -1), target);
            this.Cursor.SetPath([...target.parent, id]);
        },
        Up: () => {
            const id = this.Cursor.Path[this.Cursor.Path.length - 1];
            const target = this.Cursor.getTopMove();
            if (!target)
                return;
            this.Items.get(id).Move(this.Cursor.Path.slice(0, -1), target);
            this.Cursor.SetPath([...target.parent, id]);
        }
    };

    Add(parent = this.Cursor.getParent(),
        dbo = {
            Content: [{Text: ''}],
            Children: [],
            Id: Id(),
            Time: utc().toISO()
        },
        index = this.Cursor.getCurrentIndex() + 1) {
        const context = new Context(this, dbo);
        this.Items.set(context.Id, context);
        parent.InsertAt(context, index);
        parent.Update.next();

        this.Cursor.SetPath([this.Root.Id])
        this.OnAdd.next(context);
        return context;
    }

    Delete() {
        this.Cursor.getParent().RemoveChild(this.Cursor.getCurrent());
    }


    AddChild$ = new ReplaySubject<{
        ParentId; ChildId; Index;
    }>(1);
    RemoveChild$ = new ReplaySubject<{
        ParentId; Index;
    }>(1);
    ChangeText$ = new ReplaySubject<{
        ContextId: Id;
        Text: string;
    }>(1);

    switchCollapsed() {
        const current = this.Cursor.getCurrent()
        current.Collapsed = !current.Collapsed;
        current.Update.next();
    }
}
