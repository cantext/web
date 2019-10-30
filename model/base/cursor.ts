import {Leaf} from "./leaf";
import {ILeaf, Tree} from "./tree";
import {Id, Path} from "./id";
import {debounceTime, Observable, ReplaySubject, shareReplay, startWith} from "@hypertype/core";

export class TreeCursor<TLeaf extends Leaf<TValue, TKey>,
    TValue extends ILeaf<TKey>,
    TKey = Id> {

    constructor(private tree: Tree<TLeaf, TValue, TKey>) {

    }

    private isRoot(path: Path<TKey>) {
        return path.length == 1;
    }

    private getCurrent(path: Path<TKey>): TLeaf {
        const [currentId] = path.slice(-1);
        return this.tree.Items.get(currentId);
    }

    private getParent(path: Path<TKey>): TLeaf {
        const [parentId] = path.slice(-2);
        return this.tree.Items.get(parentId);
    }

    private getGrand(path: Path<TKey>): TLeaf {
        const [grandId] = path.slice(-3);
        return this.tree.Items.get(grandId);
    }

    public Path: Path<TKey> = [];

    public getLeftMove(path = this.Path): { parent: Path<TKey>, index: number } {
        if (path.length < 3)
            return null;
        const grand = this.getGrand(path);
        const parent = this.getParent(path);
        const parentIndex = grand.Value.Children.indexOf(parent.Id);
        return {
            parent: path.slice(0, -2),
            index: parentIndex + 1
        };
    }

    public getRightMove(path = this.Path): { parent: Path<TKey>, index: number } {
        if (this.isRoot(path))
            return null;
        const parent = this.getParent(path);
        const current = this.getCurrent(path);
        const index = parent.Value.Children.indexOf(current.Id);
        if (index == 0)
            return null;
        const newParent = parent.Children[index - 1];
        const lastChildId = newParent.Value.Children[newParent.Value.Children.length - 1];
        return {
            parent: [
                ...path.slice(0, -1),
                newParent.Id,
            ],
            index: newParent.Value.Children.length
        };
    }

    public getTopMove(path = this.Path): { parent: Path<TKey>, index: number } {
        if (this.isRoot(path))
            return null;
        const parent = this.getParent(path);
        const current = this.getCurrent(path);
        const index = parent.Value.Children.indexOf(current.Id);
        if (index > 0)
            return {
                parent: path.slice(0, -1),
                index: index - 1
            };
        if (path.length == 2)
            return null;
        const grand = this.getGrand(path)
        const parentIndex = grand.Value.Children.indexOf(parent.Id);
        return {
            parent: path.slice(0, -2),
            index: parentIndex
        };
    }

    public getBottomMove(path = this.Path): { parent: Path<TKey>, index: number } {
        if (this.isRoot(path))
            return null;
        const [parentId, currentId] = path.slice(-2);
        const parent = this.tree.Items.get(parentId);
        const index = parent.Value.Children.indexOf(currentId);
        if (index < parent.Value.Children.length - 1)
            return {
                parent: path.slice(0, -1),
                index: index + 1
            };
        return this.getLeftMove()
    }

    public Update = new ReplaySubject<Path<TKey>>(1);
    public Path$: Observable<Path<TKey>> = this.Update.pipe(
        startWith(this.Path),
        debounceTime(0),
        shareReplay(1),
    );

    SetPath(path) {
        if (path == null)
            return;
        console.log(path);
        this.Path = path;
        this.Update.next(this.Path);
    }


    Up() {
        this.SetPath(this.GetUp());
    }

    Down() {
        this.SetPath(this.GetDown());
    }


    getLastChild(path: Path<TKey>) {
        const current = this.getCurrent(path);
        if (current.Value.Children.length == 0)
            return path;
        return this.getLastChild([
            ...path,
            current.Value.Children[current.Value.Children.length - 1]
        ])
    }

    getNextChild(path: Path<TKey>) {
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
        return this.getNextChild(path.slice(0, -1));
    }

    GetUp(path = this.Path) {
        if (path.length == 1)
            return null;
        const [parentId, currentId] = path.slice(-2);
        const parent = this.tree.Items.get(parentId);
        const index = parent.Value.Children.indexOf(currentId);
        if (index > 0)
            return this.getLastChild([
                ...path.slice(0, -1),
                parent.Value.Children[index - 1]
            ]);
        return path.slice(0, -1)
    }

    GetDown(path = this.Path) {
        const current = this.getCurrent(path);
        if (current.Value.Children.length) {
            return [
                ...path,
                current.Value.Children[0]
            ];
        }
        return this.getNextChild(path);
    }
}