import { Id } from "./base/id";
import { Tree } from "./base/tree";
import { Context } from "./context";
import { ContextDbo, RootDbo } from "./dbo/context.dbo";
import { User } from "./user";
import { Observable, ReplaySubject } from "@hypertype/core";
export declare class ContextTree extends Tree<Context, ContextDbo, Id> {
    constructor();
    Items: Map<Id, Context>;
    Root: Context;
    readonly Parent: any;
    readonly Children: Context[];
    UserMap: Map<Id, User>;
    CurrentUser: User;
    Load(dbo?: RootDbo): void;
    ToDbo(): RootDbo;
    Update: ReplaySubject<void>;
    OnAdd: ReplaySubject<Context>;
    State$: Observable<ContextTree>;
    Move: {
        Left: () => void;
        Right: () => void;
        Down: () => void;
        Up: () => void;
    };
    Add(): Context;
    Delete(): void;
    AddChild$: ReplaySubject<{
        ParentId: any;
        ChildId: any;
        Index: any;
    }>;
    RemoveChild$: ReplaySubject<{
        ParentId: any;
        Index: any;
    }>;
    ChangeText$: ReplaySubject<{
        ContextId: string;
        Text: string;
    }>;
}
