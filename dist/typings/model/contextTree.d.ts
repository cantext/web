import { Id } from "./base/id";
import { Tree } from "./base/tree";
import { Context } from "./context";
import { ContextDbo, RootDbo } from "./dbo/context.dbo";
import { User } from "./user";
import { Observable, ReplaySubject } from "@hypertype/core";
export declare class ContextTree extends Tree<Context, ContextDbo, Id> {
    Items: Map<Id, Context>;
    Root: Context;
    readonly Parent: any;
    readonly Children: Context[];
    UserMap: Map<Id, User>;
    CurrentUser: User;
    constructor(dbo?: RootDbo);
    Update: ReplaySubject<void>;
    State$: Observable<ContextTree>;
    Move: {
        Left: () => void;
        Right: () => void;
        Down: () => void;
        Up: () => void;
    };
    Add(): void;
}
