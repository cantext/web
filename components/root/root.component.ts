import {Component, HyperComponent, wire} from "@hypertype/ui";
import {ContextTree} from "../../model/contextTree";
import {fromEvent, Injectable, merge, tap} from "@hypertype/core";

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, tree: ContextTree) =>  html`
        <google-login></google-login>
        ${ tree.Root ? wire(wire, tree.Root.getKey([]))`
            <app-context path="${[tree.Root.Id]}"></app-context>
        ` : ''}
    `,
    style: require('./root.style.less')
})
export class RootComponent extends HyperComponent<ContextTree> {

    constructor(private tree: ContextTree) {
        super();
    }

    public State$ = this.tree.State$;

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