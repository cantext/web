import { Id, IdPath } from "./id";
export declare type Leaf<T> = {
    Children: T[];
    Parent: T;
};
export declare abstract class GeneralTree<T extends GeneralTree<T, TKey>, TKey = Id> {
    private readonly this;
    flatMap<U>(fn: (t: T) => U): any;
    map<U extends Leaf<U>>(fn: (t: T) => U): U;
    forEach(fn: (t: T) => void | any): void;
    get(ids: TKey[]): T;
    Id: TKey;
    Path: IdPath;
    Children: T[];
    Parent: T;
    protected MoveLeft(): void;
    protected MoveRight(): void;
    protected MoveUp(): void;
    protected MoveDown(): void;
    readonly PrevSibling: T;
    readonly NextSibling: T;
    readonly Prev: T;
    readonly Next: T;
}
export declare function treeMap<T>(root: T, children: (t: T) => T[]): {
    map: <U extends Leaf<U>>(fn: (t: T) => U) => U;
    forEach: (fn: (t: T) => any) => void;
};
