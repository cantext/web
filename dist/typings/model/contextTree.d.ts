import { Id } from "./base/id";
import { Tree } from "./base/tree";
import { Context } from "./context";
import { ContextDbo, RootDbo } from "./dbo/context.dbo";
import { User } from "./user";
import { Observable, ReplaySubject } from "@hypertype/core";
import { EmailGoogleApi } from "../google-api/email.google-api";
export declare class ContextTree extends Tree<Context, ContextDbo, Id> {
    email: EmailGoogleApi;
    constructor(email: EmailGoogleApi);
    Send(to: string, content: string): Promise<void>;
    Items: Map<Id, Context>;
    Root: Context;
    get Parent(): any;
    get Children(): Context[];
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
    Add(parent?: Context, dbo?: {
        Content: {
            Text: string;
        }[];
        Children: any[];
        Id: string;
        Time: any;
    }, index?: number): Context;
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
    switchCollapsed(): void;
}
