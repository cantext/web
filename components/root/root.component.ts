import {Component, HyperComponent} from "@hypertype/ui";
import {ContextTree} from "../../model/contextTree";
import {fromEvent, Injectable, merge, tap} from "@hypertype/core";
import {SelectionStore} from "../../store/selection.store";

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, root: ContextTree) => html`
        <app-context path="${[root.Root.Id]}"></app-context>
    `,
    style: require('./root.style.less')
})
export class RootComponent extends HyperComponent<ContextTree> {

    constructor(private root: ContextTree,
                private selectionStore: SelectionStore) {
        super();
    }

    public State$ = this.root.State$;

    public Actions$ = merge(
        fromEvent(document, 'keydown').pipe(
            tap((event: KeyboardEvent) => {
                switch (event.key) {
                    case 'ArrowUp':
                        event.preventDefault();
                        if (event.ctrlKey)
                            this.root.Move.Up();
                        else
                            this.root.Cursor.Up();
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        if (event.ctrlKey)
                            this.root.Move.Down();
                        else
                            this.root.Cursor.Down();
                        break;
                    case 'ArrowLeft':
                        if (event.ctrlKey)
                            this.root.Move.Left();
                        break;
                    case 'ArrowRight':
                        if (event.ctrlKey)
                            this.root.Move.Right();
                        break;
                    case 'Tab':
                        event.preventDefault();
                        event.shiftKey ? this.root.Move.Left() : this.root.Move.Right();
                        break;
                }

            })
        ),

        fromEvent(document, 'keyup').pipe(
            tap(() => {

            })
        )
    );
}