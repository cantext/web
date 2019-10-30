import { HyperComponent } from "@hypertype/ui";
import { ContextTree } from "../../model/contextTree";
import { SelectionStore } from "../../store/selection.store";
export declare class RootComponent extends HyperComponent<ContextTree> {
    private root;
    private selectionStore;
    constructor(root: ContextTree, selectionStore: SelectionStore);
    State$: import("@hypertype/core").Observable<ContextTree>;
    Actions$: import("@hypertype/core").Observable<Event | KeyboardEvent>;
}
