import { ContextDbo, RelationType } from "./dbo/context.dbo";
import { User } from "./user";
import { Id, Path } from "./base/id";
import { ContextTree } from "./contextTree";
import { Leaf } from "./base/leaf";
import { Observable, ReplaySubject } from "@hypertype/core";
export declare class Context extends Leaf<ContextDbo, Id> {
    SetText(text: any): void;
    private get IsEmail();
    Users: Map<User, RelationType>;
    protected tree: ContextTree;
    constructor(tree: ContextTree, dbo: ContextDbo);
    LoadEmails(): Promise<void>;
    GetDbo(): any;
    toString(): string;
    get Id(): string;
    private _pathToKey;
    getKey(path: Path): any;
    Move(from: Path, { parent: to, index }: {
        parent: any;
        index: any;
    }): void;
    Update: ReplaySubject<void>;
    State$: Observable<Context>;
    RemoveChild(child: this): void;
    InsertAt(child: Context, index: any): void;
    Focus(path: Path): void;
}
