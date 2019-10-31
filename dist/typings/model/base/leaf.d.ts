import { ILeaf, Tree } from "./tree";
import { Id } from "./id";
export declare abstract class Leaf<TValue extends ILeaf<TKey>, TKey = Id> {
    protected tree: Tree<this, TValue, TKey> & any;
    Value: TValue;
    get(ids: TKey[]): this;
    abstract readonly Id: TKey;
    Parents: Map<TKey, this>;
    readonly Children: this[];
    protected RemoveChild(child: this): void;
    InsertAt(child: this, index: any): void;
    protected Switch(index1: number, index2: number): void;
}
