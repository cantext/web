import {Component, HyperComponent, wire} from "@hypertype/ui";
import {ContextTree} from "../../model/contextTree";
import {fromEvent, Injectable, merge, tap, map, Observable, combineLatest} from "@hypertype/core";
import {ModelAdapter} from "../../services/model.adapter";
import {Router, RouterState} from "@hypertype/app";

const pages = {
    whiteboard(state: IState) {
        return wire(wire, 'whiteboard')`
            <ctx-whiteboard></ctx-whiteboard>
        `
    },

    tree(state: IState) {
        if (!state.tree.Root)
            return '';
        return wire(wire,'tree')`
            <app-context path="${[state.tree.Root.Id]}"></app-context>
        `;
    }
};

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, state: IState, events) => html`>
        <div>
            <google-login></google-login>
            <button onclick="${state.adapter.Clear}">Clear</button>
            <button onclick="${events.goto(e =>'tree')}">tree</button>
            <button onclick="${events.goto(e => 'whiteboard')}">whiteboard</button>
        </div>
        ${pages[state.router.name](state)}
    `,
    style: require('./root.style.less')
})
export class RootComponent extends HyperComponent<IState> {

    constructor(private tree: ContextTree,
                private adapter: ModelAdapter,
                private router: Router) {
        super();
    }

    public State$: Observable<IState> = combineLatest([
        this.tree.State$,
        this.router.State$
    ]).pipe(
        map(([tree, router]) => ({tree, router, adapter: this.adapter}))
    );

    public Actions$ = merge(
        fromEvent(document, 'keydown').pipe(
            tap((event: KeyboardEvent) => {
                switch (event.key) {
                    case 'ArrowUp':
                        event.preventDefault();
                        if (event.shiftKey && event.ctrlKey)
                            this.tree.Move.Up();
                        else if (event.ctrlKey)
                            this.tree.Cursor.Up();
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        if (event.shiftKey && event.ctrlKey)
                            this.tree.Move.Down();
                        else if (event.ctrlKey)
                            this.tree.Cursor.Down();
                        break;
                    case 'ArrowLeft':
                        if (event.shiftKey && event.ctrlKey)
                            this.tree.Move.Left();
                        break;
                    case 'ArrowRight':
                        if (event.shiftKey && event.ctrlKey)
                            this.tree.Move.Right();
                        break;
                    case 'Delete':
                        if (event.shiftKey)
                            this.tree.Delete()
                        break;
                    case 'Tab':
                        event.preventDefault();
                        event.shiftKey ? this.tree.Move.Left() : this.tree.Move.Right();
                        break;
                    case 'Enter':
                        if (!event.shiftKey) {
                            this.tree.Add();
                            event.preventDefault();
                        }
                        break;
                    case 'Delete':
                        if (event.shiftKey) {
                            this.tree.Add();
                            event.preventDefault();
                        }
                        break;
                    case '.':
                    case 'ю':
                        if (event.ctrlKey)
                            this.tree.switchCollapsed();
                    default:
                    // console.log(event.key)
                }

            })
        ),

        fromEvent(document, 'keyup').pipe(
            tap(() => {

            })
        )
    );

    public Events = {
        goto: (path) => {
            this.router.Actions.navigate(path);
        }
    }
}

interface IState {
    tree: ContextTree,
    router: RouterState,
    adapter: ModelAdapter
}