import { HyperComponent } from "@hypertype/ui";
import { ContextTree } from "../../model/contextTree";
export declare class RootComponent extends HyperComponent<ContextTree> {
    private tree;
    constructor(tree: ContextTree);
    State$: import("@hypertype/core").Observable<ContextTree>;
    Actions$: import("@hypertype/core").Observable<Event | KeyboardEvent>;
}
