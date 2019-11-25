import {Component, HyperComponent, wire} from "@hypertype/ui";
import {ContextTree} from "../../model/contextTree";
import {fromEvent, Injectable, merge, tap, map, Observable, combineLatest} from "@hypertype/core";
import {ModelAdapter} from "../../services/model.adapter";
import {Router, RouterState} from "@hypertype/app";

const pages = {
    whiteboard(state: RouterState) {
        return wire(wire, 'whiteboard')`
            <ctx-whiteboard></ctx-whiteboard>
        `
    },

    tree(state: RouterState) {
        return wire(wire, 'tree')`
            <ctx-tree></ctx-tree>
        `;
    }
};

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, state: RouterState, events) => html`
        <google-login></google-login>
        <div>
            <button onclick="${events.goto(e => 'tree')}">tree</button>
            <button onclick="${events.goto(e => 'whiteboard')}">whiteboard</button>
        </div>
        ${pages[state.name](state)}
    `,
    style: require('./root.style.less')
})
export class RootComponent extends HyperComponent<RouterState> {

    constructor(private router: Router) {
        super();
    }

    public State$ = this.router.State$;

    public Events = {
        goto: (path) => {
            this.router.Actions.navigate(path);
        }
    }
}