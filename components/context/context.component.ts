import {Component, HyperComponent, property, wire} from "@hypertype/ui";
import {
    combineLatest,
    distinctUntilChanged,
    filter,
    Fn,
    Injectable,
    map,
    mapTo,
    merge,
    Observable,
    shareReplay,
    switchMap,
    tap,
    fromEvent,
    first,
    withLatestFrom
} from "@hypertype/core";
import {RootStore} from "../../store/RootStore";
import {Context} from "../../model/context";
import {IdPath} from "../../model/base/id";
import {Root} from "../../model/root";
import {SelectionStore} from "../../store/selection.store";

@Injectable(true)
@Component({
    name: 'app-context',
    template: (html, state: IState, events) => {

        if (!state.context)
            return html``;
        const context = state.context;
        const isEmpty = state.state.includes('empty');
        const isCollapsed = state.state.includes('collapsed');
        console.log('render',context.Key, ...context.Children.map(c => c.Key));
        return html`
            <div class="${`context-inner ${state.state.join(' ')}`}">
                <div class="body">
                    <span class="arrow"></span>
                    <span id=${`editor${context.Key}`} 
                          onclick="${events.focus(e => e)}" 
                          contenteditable="true">
                        ${context.toString()}
                    </span>
                </div>
                <div class="children">
                ${isCollapsed ? '' : context.Children.map(child => 
                    wire(wire, `context${child.Key}`)`
                        <app-context path="${child.Path}"></app-context>
                    `
                )}
                </div>
            </div>
        `
    },
    style: require('./context.style.less')
})
export class ContextComponent extends HyperComponent<IState> {

    constructor(private selectionStore: SelectionStore,
                private root: Root) {
        super();
    }


    @property()
    public path$: Observable<IdPath>;
    private path: IdPath ;

    private contextInitial$ = this.path$.pipe(
        switchMap(ids => this.root.GetContext$(ids)),
        filter(Fn.Ib),
        first(),
    );

    private context$ = this.root.State$.pipe(
        withLatestFrom(this.contextInitial$),
        map(([,context]) => context),
        distinctUntilChanged(null, context => `${context.toString()}.${context.Children.map(c => c.Key).join('.')}`),
        // tap(context => console.log(`${context.toString()}.${context.Children.map(c => c.Key).join('.')}`)),
        shareReplay(1),
    );

    private IsSelected$ = combineLatest([
        this.selectionStore.asObservable(),
        this.contextInitial$,
    ]).pipe(
        map(([state, context]) => {
            if (!state || !context)
                return false;
            return state.Key == context.Key;
        }),
        distinctUntilChanged(),
        shareReplay(1),
    );

    public State$ = combineLatest([
        this.context$,
        this.IsSelected$,
    ]).pipe(
        map(([context, isSelected]) => ({
            context, isSelected,
            state: [
                isSelected ? 'selected' : '',
                (context.Children.length == 0) ? 'empty' : '',
                (context.Collapsed) ? 'collapsed' : ''
            ] as any[],
        })),
        filter(Fn.Ib)
    );

    private Editor$ = combineLatest([this.Element$, this.context$]).pipe(
        first(),
        map(([element, context]) =>
            element.querySelector(`#editor${context.Key}`) as HTMLElement)
    );

    public Actions$ = merge(
        combineLatest([this.IsSelected$, this.Editor$]).pipe(
            tap(([isSelected, editor]) => {
                if (isSelected && document.activeElement != editor) {
                    console.log('focus', this.path, isSelected);
                    editor.focus();
                }
            })
        ),
        this.Events$.pipe(
            filter(e => e.type == 'focus'),
            tap(async ({args}) => {
                this.selectionStore.Actions.Path(this.path);
            })
        )
    ).pipe(
        mapTo(null)
    )
}

interface IState {
    state: ('empty' | 'collapsed')[];
    context: Context;
    isSelected: boolean;
}