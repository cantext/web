import {ActionsCreator, objectReducer, ObservableStore, Reducer, RootStore as RStore} from "@hypertype/app";
import {Fn, Injectable} from "@hypertype/core";
import {Root} from "../model/root";


@Injectable()
export class RootStore extends ObservableStore<RootState> {
    constructor(rootStore: RStore, private root: Root) {
        super(rootStore, 'root');
    }

    public Actions = new ActionsCreator();

    public reducer = {
        reduce: objectReducer<RootState>(Fn.I)
    }

}

export class RootState {
}
