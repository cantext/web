import { HyperComponent } from "@hypertype/ui";
import { Root } from "../../model/root";
import { SelectionStore } from "../../store/selection.store";
export declare class RootComponent extends HyperComponent<Root> {
    private root;
    private selectionStore;
    constructor(root: Root, selectionStore: SelectionStore);
    State$: import("@hypertype/core").Observable<Root>;
    Actions$: import("@hypertype/core").Observable<Event | KeyboardEvent>;
}
