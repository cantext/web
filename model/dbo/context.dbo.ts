import {Id} from "../base/id";

export interface RootDbo {
    Contexts: ContextDbo[];
    Users: UserDbo[];
    Relations: RelationDbo[];
    UserState: {
        ContextsState: {
            [key: string]: ContextState
        }
    }
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

export enum RelationType {
    View = 'view',
    Notify = 'notify',
    Write = 'write',
    Responsibility = 'responsibility',
    Owner = 'owner',
}

export type ISODate = string;

export interface ContextDbo {
    Id: Id;
    ParentIds: Id[];
    Content: Content[];
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

export type Content = TextContent
    | AudioContent
    | ContextLink
    | UserLink
    | Document
    | Email;

