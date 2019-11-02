import {Component, HyperComponent, property, wire} from "@hypertype/ui";
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    filter,
    first,
    Fn,
    Injectable,
    map,
    mapTo,
    merge,
    Observable,
    shareReplay,
    switchMap,
    tap,
    withLatestFrom
} from "@hypertype/core";
import {Context} from "../../model/context";
import {Path} from "../../model/base/id";
import {ContextTree} from "../../model/contextTree";
import {ContextContentElement} from "./context-content.element";


customElements.define('context-content', ContextContentElement);

@Injectable(true)
@Component({
    name: 'app-context',
    template: (html, state: IState, events) => {

        if (!state.context)
            return html``;
        const context = state.context;
        const isEmpty = state.state.includes('empty');
        const isCollapsed = state.state.includes('collapsed');
        return html`
            <div class="${`context-inner ${state.state.join(' ')}`}">
                <div class="body">
                    <span class="arrow"></span>
                    ${ContextContentElement.For(context, state.path)}
                </div>
                <div class="children">
                ${isCollapsed ? '' : context.Children.map(child =>
            wire(wire, `context${child.getKey([...state.path, child.Id])}`)`
                        <app-context path="${[...state.path, child.Id]}"></app-context>
                    `
        )}
                </div>
            </div>
        `
    },
    style: require('./context.style.less')
})
export class ContextComponent extends HyperComponent<IState> {

    constructor(private root: ContextTree) {
        super();
    }


    @property()
    public path$: Observable<Path>;

    private id$ = this.path$.pipe(
        map(ids => ids[ids.length - 1]),
        distinctUntilChanged(),
        shareReplay(1)
    );

    private context$ = this.id$.pipe(
        switchMap(id => this.root.Items.get(id).State$),
        filter(Fn.Ib),
    );

    private IsSelected$ = combineLatest([
        this.root.Cursor.Path$,
        this.path$,
    ]).pipe(
        // tap(console.log),
        map(([cursorPath, currentPath]) => {
            if (!cursorPath || !currentPath)
                return false;
            return cursorPath.join(':') == currentPath.join(':');
        }),
        distinctUntilChanged(),
        // tap((sel)=>console.log(sel, this)),
        shareReplay(1),
    );

    public State$ = combineLatest([
        this.context$,
        this.path$,
        this.IsSelected$,
    ]).pipe(
        map(([context, path, isSelected]) => ({
            context, isSelected, path,
            state: [
                isSelected ? 'selected' : '',
                (context.Children.length == 0) ? 'empty' : '',
                (context.Collapsed) ? 'collapsed' : ''
            ] as any[],
        })),
        filter(Fn.Ib)
    );

    private Editor$ = combineLatest([this.Element$, this.context$]).pipe(
        debounceTime(0),
        map(([element, context]) => {
            const editor = element.querySelector(`.editor`) as HTMLElement
            return editor;
        }),
        filter(Fn.Ib),
        first(),
    );

    public Actions$ = merge(
        combineLatest([this.IsSelected$, this.Editor$]).pipe(
            tap(([isSelected, editor]) => {
                if (isSelected && document.activeElement != editor) {
                    editor.focus();
                }
            })
        ),
        this.Events$.pipe(
            filter(e => e.type == 'click'),
            withLatestFrom(this.path$),
            tap(([, path]) => {
                this.root.Cursor.SetPath(path);
            })
        ),
        this.Events$.pipe(
            filter(e => e.type == 'text'),
            map(e => e.args),
            withLatestFrom(this.context$),
            tap(([text, context]) => {
                console.log(text);
                context.SetText(text);
            })
        )
    ).pipe(
        mapTo(null)
    )
}

interface IState {
    state: ('empty' | 'collapsed')[];
    context: Context;
    path: Path;
    isSelected: boolean;
}