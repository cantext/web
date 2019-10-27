import { ActionsCreator, ObservableStore, Reducer } from "@hypertype/app";
import { Root } from "../model/root";
import { RootState, RootStore } from "./RootStore";
import { Id, IdPath } from "../model/base/id";
export declare class SelectionStore extends ObservableStore<SelectionState> {
    private root;
    constructor(rootStore: RootStore, root: Root);
    Actions: SelectionActions;
    reducer: SelectionReducer;
}
export declare class SelectionState {
    Path: string;
    Key: Id;
}
declare class SelectionActions extends ActionsCreator<RootState> {
    private root;
    constructor(root: Root);
    Path(path: IdPath): void;
    Prev(): void;
    Next(): void;
    MoveLeft(): void;
    MoveRight(): void;
    MoveUp(): void;
    MoveDown(): void;
    private Custom;
}
declare class SelectionReducer {
    private root;
    constructor(root: Root);
    private objectReducer;
    reduce: Reducer<SelectionState>;
}
export {};
