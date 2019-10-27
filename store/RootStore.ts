import {
    ActionsCreator,
    ObservableStore,
    RootStore as RStore,
    Reducer,
    combineReducers,
    objectReducer
} from "@hypertype/app";
import {Id} from "../model/base/id";
import {Injectable} from "@hypertype/core";
import {Context} from "../model/context";

class RootActions extends ActionsCreator<RootState> {

    public Select(context: Context){
        this.Diff({
            SelectedContextId: context.Data.Id
        });
    }
}

@Injectable()
export class RootStore extends ObservableStore<RootState> {
    constructor(root: RStore){
        super(root, 'root');
    }

    public Actions = new RootActions();

    public reducer = new RootReducer();

}

export class RootState {
    SelectedContextId: Id;
}

export class RootReducer {

    private objectReducer = (state: RootState, action) => {
        return state;
    };

    public reduce: Reducer<RootState> = objectReducer<RootState>(this.objectReducer);
}