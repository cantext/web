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
    tap,
    switchMap
} from "@hypertype/core";
import {RootStore} from "../../store/RootStore";
import {Context} from "../../model/context";
import {Id, IdPath} from "../../model/base/id";
import {Root} from "../../model/root";

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
                <span class="arrow"></span>
                <span onfocusin="${events.focus(e => e)}" 
                        contenteditable="true">
                    ${context.toString()}
                </span>
                <div class="children">
                    ${isCollapsed ? '' : context.Children.map(child => wire(html, child.Id)`
                        <app-context context-id="${child.Id}"></app-context>
                    `)}
                </div>
            </div>
        `
    },
    style: require('./context.style.less')
})
export class ContextComponent extends HyperComponent<IState> {

    constructor(private rootStore: RootStore,
                private root: Root) {
        super();
    }


    @property()
    public contextId$: Observable<IdPath>;
    public contextId: IdPath;

    private context$ = this.contextId$.pipe(
        switchMap(id => this.root.GetContext$(id))
    );

    private IsSelected$ = combineLatest([
        this.rootStore.asObservable(),
        this.context$,
    ]).pipe(
        map(([state, context]) => {
            if (!state || !context)
                return false;
            return state.SelectedContextId == context.Data.Id;
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
                (context.Children.length == 0) ? 'empty' : '',
                (context.Collapsed) ? 'collapsed' : ''
            ] as any[],
        })),
        tap(({context, isSelected}) => {
            console.log('state', context.Id, isSelected);
        }),
        filter(Fn.Ib)
    );

    public Actions$ = merge(
        combineLatest([this.IsSelected$, this.select('span')]).pipe(
            tap(([isSelected, span]) => {
                if (isSelected) {
                    console.log('focus', this.contextId, isSelected);
                    (span as HTMLElement).focus();
                }
            })
        ),
        this.Events$.pipe(
            filter(e => e.type == 'focus'),
            tap(({args}) => {
                console.log('event', args, this.contextId);
                this.rootStore.Actions.Select(this.contextId);
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