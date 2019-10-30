import { HyperComponent } from "@hypertype/ui";
import { Observable } from "@hypertype/core";
import { Context } from "../../model/context";
import { Path } from "../../model/base/id";
import { ContextTree } from "../../model/contextTree";
import { SelectionStore } from "../../store/selection.store";
export declare class ContextComponent extends HyperComponent<IState> {
    private selectionStore;
    private root;
    constructor(selectionStore: SelectionStore, root: ContextTree);
    path$: Observable<Path>;
    private id$;
    private context$;
    private IsSelected$;
    State$: Observable<{
        context: Context;
        isSelected: boolean;
        path: string[];
        state: any[];
    }>;
    private Editor$;
    Actions$: Observable<any>;
}
interface IState {
    state: ('empty' | 'collapsed')[];
    context: Context;
    path: Path;
    isSelected: boolean;
}
export {};
