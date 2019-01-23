import { Observable, Subject } from 'rxjs';

import { Hook } from './hook';

export interface StateProperties {
    name?: string;
    hooks?: Hook[];
}

export interface Event {
    name: string;
    data: any;
}

export class State {
    private _hooks: Hook[];
    private _name: string;
    private _$event: Subject<Event> = new Subject<Event>();

    constructor({ name = 'state', hooks = [] }: StateProperties = {}) {
        this._name = name;
        this._hooks = hooks;
    }

    public get name(): string {
        return this._name;
    }

    public get $event(): Observable<Event> {
        return this._$event.asObservable();
    }

    public hook(...hooks: Hook[]): State {
        this._hooks.push(...hooks);

        return this;
    }

    public trigger(hookName: string, data = {}) {
        this._hooks
            .filter(r => r.name === hookName)
            .map(r => r.action(data));

        return this;
    }

    public emit(event: string, data = {}) {
        this._$event.next({ name: event, data });

        return this;
    }

    /**
     * Creates a new state based on the current hooks
     * @param properties properties of the extended state
     */
    public extend({ name, hooks }: StateProperties) {
        return new State({
            name,
            hooks: [...this._hooks, ...(hooks || [])]
        });
    }
}