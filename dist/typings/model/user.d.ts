import { RelationType, UserDbo } from "./dbo/context.dbo";
import { Context } from "./context";
export declare class User {
    constructor(dbo: UserDbo);
    Data: UserDbo;
    Contexts: Map<Context, RelationType>;
}
