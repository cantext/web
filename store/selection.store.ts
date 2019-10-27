import {Injectable} from "@hypertype/core";
import {ActionsCreator, objectReducer, ObservableStore, Reducer} from "@hypertype/app";
import {Root} from "../model/root";
import {RootState, RootStore} from "./RootStore";

@Injectable()
export class SelectionStore extends ObservableStore<SelectionState> {
    constructor(rootStore: RootStore, private root: Root) {
        super(rootStore, 'select');
    }

    public Actions = new SelectionActions(this.root);

    public reducer = new SelectionReducer(this.root);

}

export class SelectionState {
    SelectedContextIdPath: string;
}

enum Actions {
    right,
    left,
    prev,
    next,
}

class SelectionActions extends ActionsCreator<RootState> {

    constructor(private root: Root) {
        super();
    }


    public Path(ids: string) {
        this.Diff({
            SelectedContextIdPath: ids
        });
    }

    public Prev() {
        this.Custom(Actions.prev);
    }

    Next() {
        this.Custom(Actions.next);
    }

    Left() {
        this.Custom(Actions.left);
    }
    Right() {
        this.Custom(Actions.right);
    }

    private Custom(type: Actions, payload?) {
        return this.Action({
            type: Actions[type],
            payload
        })
    }

}

class SelectionReducer {
    constructor(private root: Root) {

    }


    private objectReducer = (state: SelectionState, action) => {
        if (!state.SelectedContextIdPath)
            state.SelectedContextIdPath = this.root.MainContext.Id;
        const selectedContext = this.root.get(state.SelectedContextIdPath.split(':'));
        switch (Actions[action.type as string]) {
            case Actions.left:
                selectedContext.Actions.Move.Left();
                return {
                    SelectedContextIdPath: selectedContext.Path.join(':')
                };
            case Actions.right:
                selectedContext.Actions.Move.Right();
                return {
                    SelectedContextIdPath: selectedContext.Path.join(':')
                };
            case Actions.prev:
                if (!selectedContext.Prev)
                    return state;
                return {
                    SelectedContextIdPath: selectedContext.Prev.Path.join(':')
                };
            case Actions.next:
                if (!selectedContext.Next)
                    return state;
                return {
                    SelectedContextIdPath: selectedContext.Next.Path.join(':')
                };
        }
        return state;
    };

    public reduce: Reducer<SelectionState> = objectReducer<SelectionState>(this.objectReducer);
}