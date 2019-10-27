import {Component, HyperComponent} from "@hypertype/ui";
import {Root} from "../../model/root";
import {fromEvent, Injectable, merge, tap} from "@hypertype/core";
import {SelectionStore} from "../../store/selection.store";

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, root: Root) => html`
        <app-context context-ids="${root.MainContext.Path}"></app-context>
    `,
    style: require('./root.style.less')
})
export class RootComponent extends HyperComponent<Root> {

    constructor(private root: Root,
                private selectionStore: SelectionStore) {
        super();
    }

    public State$ = this.root.State$;

    public Actions$ = merge(
        fromEvent(document, 'keydown').pipe(
            tap((event: KeyboardEvent) => {
                switch (event.key) {
                    case 'ArrowUp':
                        this.selectionStore.Actions.Prev();
                        break;
                    case 'ArrowDown':
                        this.selectionStore.Actions.Next();
                        break;
                    case 'Tab':
                        event.shiftKey ?
                            this.selectionStore.Actions.Left() :
                            this.selectionStore.Actions.Right();
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