import {Component, HyperComponent} from "@hypertype/ui";
import {IState, Template} from "./tree.template";
import {ContextTree} from "../../model/contextTree";
import {ModelAdapter} from "../../services/model.adapter";
import {Router} from "@hypertype/app";
import {Injectable, fromEvent, tap, merge, Observable, map} from "@hypertype/core";

@Injectable(true)
@Component({
    name: 'ctx-tree',
    template: Template,
    style: require('./tree.style.less')
})
export class TreeComponent extends HyperComponent<IState> {

    constructor(private tree: ContextTree,
                private adapter: ModelAdapter,
                private router: Router) {
        super();
    }

    public State$: Observable<IState> = this.tree.State$.pipe(
        map((tree) => ({tree, adapter: this.adapter}))
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

}
    