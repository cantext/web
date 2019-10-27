import {DefaultData} from "./dbo/default";
import {Id, IdPath} from "./base/id";
import {treeMap} from "./base/tree";
import {Context} from "./context";
import {ContextDbo, RootDbo} from "./dbo/context.dbo";
import {User} from "./user";
import {filter, Fn, map, Observable, of} from "@hypertype/core";


export class Root {
    ContextMap: Map<Id, Context[]>;
    MainContext: Context;
    UserMap: Map<Id, User>;
    CurrentUser: User;

    constructor(dbo: RootDbo = DefaultData()) {
        this.UserMap = new Map(dbo.Users.map(userDbo => [userDbo.Id, new User(userDbo)]));
        const mainContextDbo = dbo.Contexts.find(c => c.ParentIds.length == 0);
        const contextDboTree = treeMap<ContextDbo>(mainContextDbo, item => dbo.Contexts
            .filter(c => c.ParentIds.includes(item.Id)));

        this.MainContext = contextDboTree.map(t => new Context(t));
        this.MainContext.forEach(context => {
            context.Children.forEach((child, i) => {
                if (i > 0)
                    child.PrevSibling = context.Children[i - 1];
                if (i < context.Children.length - 1)
                    child.NextSibling = context.Children[i + 1];
            });
        });

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
    }


    public State$: Observable<Root> = of(this);

    public GetContext$(id: IdPath): Observable<Context> {
        return this.MainContext.find(id);
    }
}


