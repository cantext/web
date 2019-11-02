import { ContextDbo, RelationType } from "./dbo/context.dbo";
import { User } from "./user";
import { Id, Path } from "./base/id";
import { ContextTree } from "./contextTree";
import { Leaf } from "./base/leaf";
import { Observable, ReplaySubject } from "rxjs";
export declare class Context extends Leaf<ContextDbo, Id> {
    SetText(text: any): void;
    Users: Map<User, RelationType>;
    Collapsed: boolean;
    protected tree: ContextTree;
    constructor(tree: ContextTree, dbo: ContextDbo);
    GetDbo(): any;
    toString(): string;
    readonly Id: string;
    private _pathToKey;
    getKey(path: Path): any;
    Move(from: Path, { parent: to, index }: {
        parent: any;
        index: any;
    }): void;
    Update: ReplaySubject<void>;
    State$: Observable<Context>;
    RemoveChild(child: this): void;
    InsertAt(child: this, index: any): void;
    Focus(path: Path): void;
}
