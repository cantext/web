import {Leaf} from "./leaf";
import {ILeaf, Tree} from "./tree";
import {Id, Path} from "./id";
import {debounceTime, mapTo, Observable, ReplaySubject, shareReplay, startWith} from "@hypertype/core";

export class TreeCursor<TLeaf extends Leaf<TValue, TKey>,
    TValue extends ILeaf<TKey>,
    TKey = Id> {

    constructor(private tree: Tree<TLeaf, TValue, TKey>) {

    }

    public get Selected(): TLeaf {
        return this.tree.Items.get(this.Path[this.Path.length - 1]);
    }

    public Path: Path<TKey>;

    public getLeft(path = this.Path): Path<TKey> {
        if (path.length < 3)
            return null;
        return path.slice(0, -1);
    }

    public getRight(path = this.Path): Path<TKey> {
        if (path.length == 1)
            return null;
        const [parentId, currentId] = path.slice(-2);
        const parent = this.tree.Items.get(parentId);
        const index = parent.Value.Children.indexOf(currentId);
        if (index == 0)
            return null;
        const newParent = parent.Children[index - 1];
        const lastChildId = newParent.Value.Children[newParent.Value.Children.length - 1];
        return [
            ...path.slice(0, -1),
            newParent.Id,
            lastChildId
        ]
    }

    public getTop(path = this.Path): Path<TKey> {
        if (path.length == 1)
            return null;
        const [parentId, currentId] = path.slice(-2);
        const parent = this.tree.Items.get(parentId);
        const index = parent.Value.Children.indexOf(currentId);
        if (index > 1)
            return [
                ...path.slice(0, -1),
                parent.Value.Children[index - 2]
            ];
        if (index == 1)
            return [
                ...path.slice(0, -1),
                undefined
            ];
        return this.getTop(path.slice(0, -1));
    }

    public getBottom(path = this.Path): Path<TKey> {
        if (path.length == 1)
            return null;
        const [parentId, currentId] = path.slice(-2);
        const parent = this.tree.Items.get(parentId);
        const index = parent.Value.Children.indexOf(currentId);
        if (index < parent.Value.Children.length - 1)
            return [
                ...path.slice(0, -1),
                parent.Value.Children[index + 1]
            ];
        return path.slice(0, -1);
    }

    public Update = new ReplaySubject<void>(1);
    public Path$: Observable<Path<TKey>> = this.Update.pipe(
        startWith(this.Path),
        debounceTime(0),
        mapTo(this.Path),
        shareReplay(1),
    );

    SetPath(path) {
        this.Path = path;
        this.Update.next();
    }

    Up() {
        this.SetPath(this.getTop());
    }

    Down() {
        this.SetPath(this.getBottom());
    }
}