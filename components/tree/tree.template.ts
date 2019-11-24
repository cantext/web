import {IEventHandler, wire} from "@hypertype/ui";
import {ContextTree} from "../../model/contextTree";
import {ModelAdapter} from "../../services/model.adapter";

export const Template = (html, state: IState) => html`
    <google-login></google-login>
    <button onclick="${state.adapter.Clear}">Clear</button>
    <app-context path="${[state.tree.Root.Id]}"></app-context>
`;

export interface IState {
    tree: ContextTree;
    adapter: ModelAdapter
}