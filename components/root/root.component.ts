import {Component, HyperComponent, wire} from "@hypertype/ui";
import {ContextTree} from "../../model/contextTree";
import {fromEvent, Injectable, merge, tap, map, Observable} from "@hypertype/core";
import {ModelAdapter} from "../../services/model.adapter";

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, tree: ContextTree&{adapter: ModelAdapter}) =>  html`
        <google-login></google-login>
        <button onclick="${tree.adapter.Clear}">Clear</button>
        ${ tree.Root ? wire(wire, tree.Root.getKey([]))`
            <app-context path="${[tree.Root.Id]}"></app-context>
        ` : ''}
    `,
    style: require('./root.style.less')
})
export class RootComponent extends HyperComponent<ContextTree&{adapter: ModelAdapter}> {

    constructor(private tree: ContextTree,
                private adapter: ModelAdapter) {
        super();
    }

    public State$: Observable<any> = this.tree.State$.pipe(
        map(state => ({...state, adapter: this.adapter}))
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
                        if (!event.shiftKey){
                            this.tree.Add();
                            event.preventDefault();
                        }
                        break;
                    case 'Delete':
                        if (event.shiftKey){
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
}