export type Id = string;
export type IdPath = Id[];

let counter = 0;
export function Id(): Id {
    return (counter++).toString();
}