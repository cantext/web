import {Component, HyperComponent} from "@hypertype/ui";
import {Root} from "../../model/root";
import {fromEvent, Injectable, merge, tap} from "@hypertype/core";
import {SelectionStore} from "../../store/selection.store";

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, root: Root) => html`
        <app-context path="${root.MainContext.Path}"></app-context>
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
                        event.preventDefault();
                        if (event.ctrlKey)
                            this.selectionStore.Actions.MoveUp();
                        else
                            this.selectionStore.Actions.Prev();
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        if (event.ctrlKey)
                            this.selectionStore.Actions.MoveDown();
                        else
                            this.selectionStore.Actions.Next();
                        break;
                    case 'Tab':
                        event.preventDefault();
                        event.shiftKey ?
                            this.selectionStore.Actions.MoveLeft() :
                            this.selectionStore.Actions.MoveRight();
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