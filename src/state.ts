import { Observable, Subject } from 'rxjs';

import { ActionContext, Hook } from './hook';

export interface StateProperties<G = any> {
    name?: string;
    hooks?: Hook<G>[];
}

export interface Event<L = any> {
    name: string;
    data: L;
}

export class State<G = any> {
    private _hooks: Hook<G>[];
    private _name: string;
    private _$event: Subject<Event> = new Subject<Event>();

    constructor({ name = 'state', hooks = [] }: StateProperties<G> = {}) {
        this._name = name;
        this._hooks = hooks;
    }

    public get name(): string {
        return this._name;
    }

    public get $event(): Observable<Event> {
        return this._$event.asObservable();
    }

    public hook(...hooks: Hook<G>[]): State<G> {
        this._hooks.push(...hooks);

        return this;
    }

    public trigger(hookName: string, context?: ActionContext<G>) {
        this._hooks
            .filter(r => r.name === hookName)
            .map(r => r.action(context));

        return this;
    }

    public emit(event: string, data?: any) {
        this._$event.next({ name: event, data });

        return this;
    }

    /**
     * Creates a new state based on the current hooks
     * @param properties properties of the extended state
     */
    public extend({ name, hooks }: StateProperties<G>) {
        return new State({
            name,
            hooks: [...this._hooks, ...(hooks || [])]
        });
    }
}