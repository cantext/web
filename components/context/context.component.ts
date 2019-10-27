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
    fromEvent
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
        return html`
            <div class="${`context-inner ${state.state.join(' ')}`}">
                <div class="body">
                    <span class="arrow"></span>
                    <span onfocusin="${events.focus(e => e)}" 
                            contenteditable="true">
                        ${context.toString()}
                    </span>
                </div>
                <div class="children">
                ${isCollapsed ? '' : context.Children.map(child => 
                    wire(wire, `context${child.Key}`)`
                        <app-context context-ids="${child.Path}"></app-context>
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
    public contextIds$: Observable<IdPath>;

    private get contextIds(): IdPath {
        return this['context-ids'];
    }

    private context$ = this.contextIds$.pipe(
        switchMap(ids => this.root.GetContext$(ids)),
    );

    private IsSelected$ = combineLatest([
        this.selectionStore.asObservable(),
        this.context$,
    ]).pipe(
        map(([state, context]) => {
            if (!state || !context)
                return false;
            return state.SelectedContextIdPath == context.Path.join(':');
        }),
        distinctUntilChanged(),
        shareReplay(1),
    );

    public State$ = combineLatest([
        this.context$,
        this.IsSelected$,
    ]).pipe(
        // tap(([context, isSelected]) => {
        //     console.log('state', context.Id, isSelected);
        // }),
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

    public Actions$ = merge(
        combineLatest([this.IsSelected$, this.select('[contenteditable]')]).pipe(
            tap(([isSelected, span]) => {
                if (isSelected) {
                    // console.log('focus', this.contextIds, isSelected);
                    (span as HTMLElement).focus();
                }
            })
        ),
        this.Events$.pipe(
            filter(e => e.type == 'focus'),
            tap(async ({args}) => {
                // console.log('event', args, this.contextIds);
                this.selectionStore.Actions.Path(this.contextIds.join(':'));
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