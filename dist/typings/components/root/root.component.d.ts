import { HyperComponent } from "@hypertype/ui";
import { ContextTree } from "../../model/contextTree";
import { Observable } from "@hypertype/core";
import { ModelAdapter } from "../../services/model.adapter";
export declare class RootComponent extends HyperComponent<ContextTree & {
    adapter: ModelAdapter;
}> {
    private tree;
    private adapter;
    constructor(tree: ContextTree, adapter: ModelAdapter);
    State$: Observable<any>;
    Actions$: Observable<Event | KeyboardEvent>;
}
