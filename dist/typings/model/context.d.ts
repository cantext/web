import { ContextDbo, RelationType } from "./dbo/context.dbo";
import { GeneralTree } from "./base/tree";
import { User } from "./user";
import { Id } from "./base/id";
import { Root } from "./root";
export declare class Context extends GeneralTree<Context> {
    private root;
    Data: ContextDbo;
    Children: Context[];
    Parent: Context;
    Users: Map<User, RelationType>;
    Collapsed: boolean;
    constructor(root: Root, dbo: ContextDbo);
    GetDbo(): any;
    toString(): string;
    readonly Id: string;
    readonly Path: any[];
    Key: Id;
    Actions: {
        Move: {
            Left: () => void;
            Right: () => void;
            Down: () => void;
            Up: () => void;
        };
    };
}
