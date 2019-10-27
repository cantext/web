import { HyperComponent } from "@hypertype/ui";
import { Observable } from "@hypertype/core";
import { Context } from "../../model/context";
import { IdPath } from "../../model/base/id";
import { Root } from "../../model/root";
import { SelectionStore } from "../../store/selection.store";
export declare class ContextComponent extends HyperComponent<IState> {
    private selectionStore;
    private root;
    constructor(selectionStore: SelectionStore, root: Root);
    path$: Observable<IdPath>;
    private path;
    private contextInitial$;
    private context$;
    private IsSelected$;
    State$: Observable<{
        context: Context;
        isSelected: boolean;
        state: any[];
    }>;
    private Editor$;
    Actions$: Observable<any>;
}
interface IState {
    state: ('empty' | 'collapsed')[];
    context: Context;
    isSelected: boolean;
}
export {};
