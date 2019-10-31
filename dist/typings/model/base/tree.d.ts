import { Id } from "./id";
import { Leaf } from "./leaf";
import { TreeCursor } from "./cursor";
export interface ILeaf<TKey> {
    Id: TKey;
    Children: TKey[];
}
export declare abstract class Tree<TLeaf extends Leaf<TValue, TKey>, TValue extends ILeaf<TKey>, TKey = Id> {
    abstract readonly Root: TLeaf;
    abstract readonly Items: Map<TKey, TLeaf>;
    private readonly Leafs;
    SetParents(): void;
    Cursor: TreeCursor<TLeaf, TValue, TKey>;
}
