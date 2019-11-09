import { Leaf } from "./leaf";
import { ILeaf, Tree } from "./tree";
import { Id, Path } from "./id";
import { Observable, ReplaySubject } from "@hypertype/core";
export declare class TreeCursor<TLeaf extends Leaf<TValue, TKey>, TValue extends ILeaf<TKey>, TKey = Id> {
    private tree;
    constructor(tree: Tree<TLeaf, TValue, TKey>);
    isRoot(path: Path<TKey>): boolean;
    getCurrent(path?: Path<TKey>): TLeaf;
    getCurrentIndex(path?: Path<TKey>): number;
    getParent(path?: Path<TKey>): TLeaf;
    getGrand(path?: Path<TKey>): TLeaf;
    Path: Path<TKey>;
    getLeftMove(path?: Path<TKey>): {
        parent: Path<TKey>;
        index: number;
    };
    getRightMove(path?: Path<TKey>): {
        parent: Path<TKey>;
        index: number;
    };
    getTopMove(path?: Path<TKey>): {
        parent: Path<TKey>;
        index: number;
    };
    getBottomMove(path?: Path<TKey>): {
        parent: Path<TKey>;
        index: number;
    };
    Update: ReplaySubject<Path<TKey>>;
    Path$: Observable<Path<TKey>>;
    SetPath(path: any): void;
    Up(): void;
    Down(): void;
    getLastChild(path: Path<TKey>): any;
    getNextChild(path: Path<TKey>): any;
    GetUp(path?: Path<TKey>): any;
    GetDown(path?: Path<TKey>): any;
}
