import {Id, IdPath} from "./id";

export type Leaf<T> = { Children: T[]; Parent: T; };


export abstract class GeneralTree<T extends GeneralTree<T>> {

    get this(): T {
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

    get(ids: Id[]) {
        const [id, ...rest] = ids;
        const child = this.Children.find(c => c.Id == id);
        if (!child)
            return null;
        if (!rest.length)
            return child;
        return child.get(rest);
    }

    Id: Id;
    Path: IdPath;
    Children: GeneralTree<T>[];
    Parent: GeneralTree<T>;
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
