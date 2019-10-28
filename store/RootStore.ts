import {ActionsCreator, objectReducer, ObservableStore, Reducer, RootStore as RStore} from "@hypertype/app";
import {Fn, Injectable} from "@hypertype/core";
import {ContextTree} from "../model/contextTree";


@Injectable()
export class RootStore extends ObservableStore<RootState> {
    constructor(rootStore: RStore, private root: ContextTree) {
        super(rootStore, 'root');
    }

    public Actions = new ActionsCreator();

    public reducer = {
        reduce: objectReducer<RootState>(Fn.I)
    }

}

export class RootState {
}
