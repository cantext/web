import { ActionsCreator, ObservableStore, Reducer, RootStore as RStore } from "@hypertype/app";
import { Root } from "../model/root";
export declare class RootStore extends ObservableStore<RootState> {
    private root;
    constructor(rootStore: RStore, root: Root);
    Actions: ActionsCreator<unknown>;
    reducer: {
        reduce: Reducer<RootState, import("redux").AnyAction>;
    };
}
export declare class RootState {
}
