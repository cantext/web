import { Id, IdPath } from "./base/id";
import { GeneralTree } from "./base/tree";
import { Context } from "./context";
import { RootDbo } from "./dbo/context.dbo";
import { User } from "./user";
import { Observable, ReplaySubject } from "@hypertype/core";
export declare class Root extends GeneralTree<Context> {
    ContextMap: Map<Id, Context[]>;
    MainContext: Context;
    readonly Children: Context[];
    UserMap: Map<Id, User>;
    CurrentUser: User;
    constructor(dbo?: RootDbo);
    Update: ReplaySubject<void>;
    State$: Observable<Root>;
    GetContext$(ids: IdPath): Observable<Context>;
}
