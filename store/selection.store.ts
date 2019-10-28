import {Injectable} from "@hypertype/core";
import {ActionsCreator, objectReducer, ObservableStore, Reducer} from "@hypertype/app";
import {ContextTree} from "../model/contextTree";
import {RootState, RootStore} from "./RootStore";
import {Id, Path} from "../model/base/id";

@Injectable()
export class SelectionStore extends ObservableStore<SelectionState> {
    constructor(rootStore: RootStore, private root: ContextTree) {
        super(rootStore, 'select');
    }

    public Actions = new SelectionActions(this.root);

    public reducer = new SelectionReducer(this.root);

}

export class SelectionState {
    Path: string;
}

enum Actions {
    right,
    left,
    prev,
    next,
    up,
    down
}

class SelectionActions extends ActionsCreator<SelectionState> {

    constructor(private root: ContextTree) {
        super();
    }


    public Path(path: Path) {
        this.root.Cursor.Path = path;
    }

    public Prev() {
        this.root.Cursor.Path = this.root.Cursor.getTop();
        this.root.Update.next();
    }

    public Next() {
        this.root.Cursor.Path = this.root.Cursor.getBottom();
        this.root.Update.next();
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
    constructor(private tree: ContextTree) {

    }


    private objectReducer = (state: SelectionState, action) => {
        if (!state.Path)
            state.Path = this.tree.Root.Id;
        const path = state.Path.split(':');
        const selectedContext = this.tree.Items.get(state.Path.split(':').pop());
        switch (Actions[action.type as string]) {
            /*case Actions.left:
                this.tree.Move.Left(path);
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
                };*/
        }
        return state;
    };

    public reduce: Reducer<SelectionState> = objectReducer<SelectionState>(this.objectReducer);
}