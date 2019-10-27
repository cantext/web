import {Id, IdPath} from "./id";

export type Leaf<T> = { Children: T[]; Parent: T; };


export abstract class GeneralTree<T extends GeneralTree<T, TKey>, TKey = Id> {

    private get this(): T {
        return this as any;
    }

    flatMap<U>(fn: (t: T) => U) {
        return [
            fn(this.this),
            ...this.Children.map(c => c.flatMap(fn)).flat()
        ];
    }

    map<U extends Leaf<U>>(fn: (t: T) => U) {
        const mapItem = item => {
            const result = fn(item);
            result.Children = item.Children
                .map(mapItem);
            return result;
        };
        return mapItem(this);
    }

    forEach(fn: (t: T) => void | any) {
        const forEachItem = item => {
            fn(item);
            item.Children.forEach(forEachItem);
        };
        forEachItem(this);
    }

    get(ids: TKey[]): T {
        const [id, ...rest] = ids;
        const child = this.Children.find(c => c.Id == id);
        if (!child)
            return null;
        if (!rest.length)
            return child.this;
        return child.get(rest);
    }

    Id: TKey;
    Path: IdPath;
    Children: T[];
    Parent: T;


    protected MoveLeft(){
        if (!this.Parent || !this.Parent.Parent)
            return;
        const index = this.Parent.Parent.Children.indexOf(this.Parent);
        const grandParent = this.Parent.Parent;
        this.Parent.Children.remove(this.this);
        grandParent.Children.splice(index + 1, 0, this.this);
        this.Parent = grandParent;
    }
    protected MoveRight(){
        if (!this.Parent || !this.PrevSibling)
            return;
        const prevSibling = this.PrevSibling;
        this.Parent.Children.remove(this.this);
        prevSibling.Children.push(this.this);
        this.Parent = prevSibling;
    }


    get PrevSibling(): T{
        return this.Parent.Children[this.Parent.Children.indexOf(this.this) - 1];
    }
    get NextSibling(): T{
        return this.Parent.Children[this.Parent.Children.indexOf(this.this) + 1];
    }

    public get Prev(): T {
        return this.PrevSibling || this.Parent;
    }

    public get Next(): T {
        return this.Children[0] || this.NextSibling || (this.Parent && this.Parent.NextSibling);
    }
}


export function treeMap<T>(root: T, children: (t: T) => T[]) {
    return {
        map: <U extends Leaf<U>>(fn: (t: T) => U) => {
            const mapItem = item => {
                const result = fn(item);
                result.Children = children(item)
                    .map(mapItem);
                result.Children.forEach(child => child.Parent = result);
                return result;
            };
            return mapItem(root);
        },
        forEach: (fn: (t: T) => void | any) => {
            const forEachItem = item => {
                fn(item);
                children(item)
                    .forEach(forEachItem);
            };
            forEachItem(root);
        }
    }
}
