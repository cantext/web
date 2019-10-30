import { ActionsCreator, ObservableStore, Reducer } from "@hypertype/app";
import { ContextTree } from "../model/contextTree";
import { RootStore } from "./RootStore";
import { Path } from "../model/base/id";
export declare class SelectionStore extends ObservableStore<SelectionState> {
    private root;
    constructor(rootStore: RootStore, root: ContextTree);
    Actions: SelectionActions;
    reducer: SelectionReducer;
}
export declare class SelectionState {
    Path: string;
}
declare class SelectionActions extends ActionsCreator<SelectionState> {
    private root;
    constructor(root: ContextTree);
    Path(path: Path): void;
    Prev(): void;
    Next(): void;
    MoveLeft(): void;
    MoveRight(): void;
    MoveUp(): void;
    MoveDown(): void;
    private Custom;
}
declare class SelectionReducer {
    private tree;
    constructor(tree: ContextTree);
    private objectReducer;
    reduce: Reducer<SelectionState>;
}
export {};
