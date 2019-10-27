import {DefaultData} from "./dbo/default";
import {Id, IdPath} from "./base/id";
import {GeneralTree, treeMap} from "./base/tree";
import {Context} from "./context";
import {ContextDbo, RootDbo} from "./dbo/context.dbo";
import {User} from "./user";
import {map, Observable, of, ReplaySubject, mapTo, debounceTime, tap, shareReplay} from "@hypertype/core";
import {Subject} from "@hypertype/infr/dist/typings/common/signalr/Utils";

export class Root extends GeneralTree<Context> {
    ContextMap: Map<Id, Context[]>;
    MainContext: Context;

    get Children() {
        return [this.MainContext];
    }

    UserMap: Map<Id, User>;
    CurrentUser: User;

    constructor(dbo: RootDbo = DefaultData()) {
        super();
        window['root'] = this;
        this.UserMap = new Map(dbo.Users.map(userDbo => [userDbo.Id, new User(userDbo)]));
        const mainContextDbo = dbo.Contexts.find(c => c.ParentIds.length == 0);
        const contextDboTree = treeMap<ContextDbo>(mainContextDbo, item => dbo.Contexts
            .filter(c => c.ParentIds.includes(item.Id)));

        this.MainContext = contextDboTree.map(t => new Context(this, t));

        this.ContextMap = this.MainContext
            .flatMap<Context>(c => c)
            .groupBy(c => c.Id);

        dbo.Relations.forEach(relation => {
            const contexts = this.ContextMap.get(relation.ContextId);
            const user = this.UserMap.get(relation.UserId);
            contexts.forEach(context => {
                user.Contexts.set(context, relation.Type);
                context.Users.set(user, relation.Type);
            });
        });
        for (const key in dbo.UserState.ContextsState) {
            const state = dbo.UserState.ContextsState[key];
            for (const context of this.ContextMap.get(key)) {
                context.Collapsed = state.Collapsed;
            }
        }
        this.Update.next();
    }

    public Update = new ReplaySubject<void>(1);
    public State$: Observable<Root> = this.Update.pipe(
        debounceTime(0),
        tap(() => {
            console.log(...this.MainContext.flatMap(t => t.Path));
        }),
        mapTo(this),
        shareReplay(1),
    );

    public GetContext$(ids: IdPath): Observable<Context> {
        return this.State$.pipe(
            map(root => root.get(ids))
        );
    }
}


