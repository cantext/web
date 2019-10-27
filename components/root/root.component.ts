import {Component, HyperComponent} from "@hypertype/ui";
import {Root} from "../../model/root";
import {Injectable, of, tap} from "@hypertype/core";
import {ModelProxy} from "@hypertype/domain";
import {RootState} from "../../store/RootStore";

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, root: Root) => html`
        <app-context context-id="${root.MainContext.Id}"></app-context>
    `,
    style: require('./root.style.less')
})
export class RootComponent extends HyperComponent<Root>{

    constructor(private root: Root){
        super();
    }

    public State$ = this.root.State$;
}