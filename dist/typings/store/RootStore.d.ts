import { ActionsCreator, ObservableStore, Reducer, RootStore as RStore } from "@hypertype/app";
import { ContextTree } from "../model/contextTree";
export declare class RootStore extends ObservableStore<RootState> {
    private root;
    constructor(rootStore: RStore, root: ContextTree);
    Actions: ActionsCreator<unknown>;
    reducer: {
        reduce: Reducer<RootState, import("@hypertype/app").AnyAction>;
    };
}
export declare class RootState {
}
