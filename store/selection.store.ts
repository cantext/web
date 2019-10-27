import {Injectable} from "@hypertype/core";
import {ActionsCreator, objectReducer, ObservableStore, Reducer} from "@hypertype/app";
import {Root} from "../model/root";
import {RootState, RootStore} from "./RootStore";
import {Id, IdPath} from "../model/base/id";

@Injectable()
export class SelectionStore extends ObservableStore<SelectionState> {
    constructor(rootStore: RootStore, private root: Root) {
        super(rootStore, 'select');
    }

    public Actions = new SelectionActions(this.root);

    public reducer = new SelectionReducer(this.root);

}

export class SelectionState {
    Path: string;
    Key: Id;
}

enum Actions {
    right,
    left,
    prev,
    next,
    up,
    down
}

class SelectionActions extends ActionsCreator<RootState> {

    constructor(private root: Root) {
        super();
    }


    public Path(path: IdPath) {
        const context = this.root.get(path);
        this.Diff({
            Path: path.join(':'),
            Key: context.Key,
        });
    }

    public Prev() {
        this.Custom(Actions.prev);
    }

    Next() {
        this.Custom(Actions.next);
    }

    MoveLeft() {
        this.Custom(Actions.left);
    }
    MoveRight() {
        this.Custom(Actions.right);
    }

    MoveUp() {
        this.Custom(Actions.up);
    }
    MoveDown() {
        this.Custom(Actions.down);
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
        if (!state.Path)
            state.Path = this.root.MainContext.Id;
        const selectedContext = this.root.get(state.Path.split(':'));
        switch (Actions[action.type as string]) {
            case Actions.left:
                selectedContext.Actions.Move.Left();
                return {
                    Path: selectedContext.Path.join(':'),
                    Key: selectedContext.Key,
                };
            case Actions.right:
                selectedContext.Actions.Move.Right();
                return {
                    Path: selectedContext.Path.join(':'),
                    Key: selectedContext.Key,
                };
            case Actions.up:
                selectedContext.Actions.Move.Up();
                return {
                    Path: selectedContext.Path.join(':'),
                    Key: selectedContext.Key,
                };
            case Actions.down:
                selectedContext.Actions.Move.Down();
                return {
                    Path: selectedContext.Path.join(':'),
                    Key: selectedContext.Key,
                };
            case Actions.prev:
                if (!selectedContext.Prev)
                    return state;
                return {
                    Path: selectedContext.Prev.Path.join(':'),
                    Key: selectedContext.Prev.Key,
                };
            case Actions.next:
                if (!selectedContext.Next)
                    return state;
                return {
                    Path: selectedContext.Next.Path.join(':'),
                    Key: selectedContext.Next.Key,
                };
        }
        return state;
    };

    public reduce: Reducer<SelectionState> = objectReducer<SelectionState>(this.objectReducer);
}