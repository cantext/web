import {Context} from "../../model/context";
import {Path} from "../../model/base/id";
import {fromEvent, ReplaySubject, takeUntil, tap, merge} from "@hypertype/core";

export class ContextContentElement extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.contentEditable = 'true';
        this.className = 'editor';
        this.Subscribe();
    }
    disconnectedCallback() {
        this.disconnect$.next();
        this.disconnect$.complete();
    }
    private disconnect$ = new ReplaySubject();

    private Input$ = merge(
        fromEvent(this, 'input').pipe(
            tap(() => this.Context.SetText(this.innerText)),
        ),
        fromEvent(this, 'focus').pipe(
            tap(() => this.Context.Focus(this.Path)),
        )
    ).pipe(
        takeUntil(this.disconnect$.asObservable())
    );

    public Subscribe() {
        this.Input$.subscribe();
    }

    private Context: Context;
    private Path: Path;

    private Update() {
        const text = this.innerText;
        const newText = this.Context.toString();
        if (text == newText) {
        } else {
            this.innerText = newText;
        }

    }

    private static map = new Map<Path, ContextContentElement>();

    public static For(context: Context, path: Path) {
        const key = context.getKey(path);
        if (!this.map.has(key)) {
            const div = document.createElement('context-content', {
                is: 'div'
            }) as ContextContentElement;
            div.Context = context;
            div.Path = path;
            this.map.set(key, div);
        }
        const div = this.map.get(key);
        div.Update();
        return div;
    }
}