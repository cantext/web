export type Id = string;
export type Path<TKey = Id> = TKey[];

let counter = 0;
export function Id(): Id {
    return (counter++).toString();
}