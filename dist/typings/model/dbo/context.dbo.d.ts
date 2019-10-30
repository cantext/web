import { Id } from "../base/id";
import { ILeaf } from "../base/tree";
export interface RootDbo {
    Root: Id;
    Contexts: ContextDbo[];
    Users: UserDbo[];
    Relations: RelationDbo[];
    UserState: {
        ContextsState: IMap<Id, ContextState>;
    };
}
export interface ContextState {
    Collapsed?: boolean;
}
export interface UserDbo {
    Id: Id;
    Name: string;
    Email: string;
}
export interface RelationDbo {
    UserId: Id;
    ContextId: Id;
    Type: RelationType;
}
export declare enum RelationType {
    View = "view",
    Notify = "notify",
    Write = "write",
    Responsibility = "responsibility",
    Owner = "owner"
}
export declare type ISODate = string;
export interface ContextDbo extends ILeaf<Id> {
    Content: TextContent[];
    Time: ISODate;
}
export interface TextContent {
    Text: string;
}
export interface AudioContent {
}
export interface ContextLink {
}
export interface UserLink {
}
export interface Document {
}
export interface Email {
}
export declare type Content = TextContent | AudioContent | ContextLink | UserLink | Document | Email;
export declare type IMap<TKey, TValue> = {
    [key: TKey]: TValue;
};
