import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { State } from './state';

export interface TransitionDefinition {
    from: State;
    to: State;
    on: string;
}

export interface Context {
    state: State;
    data?: any;
}

export class StateMachine {
    private _transitionMap: Map<State, Map<string, State>> = new Map<State, Map<string, State>>();
    private _initialState!: State;
    private _currentState!: State;
    private _$currentContext: Subject<Context> = new Subject<Context>();
    private _globalContext: Object;

    constructor() { }

    public get context(): Object {
        return this._globalContext;
    }

    public set context(context: Object) {
        this._globalContext = context;
    }

    public run({ initialState }: { initialState: State }) {
        if (!initialState) {
            throw new Error('The initial state was not defined!');
        }
        this._initialState = initialState;
        this._currentState = initialState;

        this._$currentContext.subscribe(ctx => {
            const state = ctx.state;
            this._currentState = state;
            state.$event
                .pipe(takeUntil(this._$currentContext))
                .subscribe(event => {
                    const next = this._getNextState(event.name, state);
                    if (next) {
                        const data = { ...event.data, context: this._globalContext }
                        state.trigger('leave', data);
                        this._$currentContext.next({ state: next, data });
                    } else {
                        console.warn(
                            `No transition defined for state "${state.name}" on event "${event.name}"`,
                            { details: { state, event, transitions: this._transitionMap } }
                        );
                    }
                });

            state.trigger('enter', { ...ctx.data, context: this._globalContext });
        });

        this._$currentContext.next({ state: this._initialState });
    }

    public transit({ from, to, on }: TransitionDefinition): StateMachine {

        const stateMap = this._transitionMap.get(from);
        if (stateMap) {
            stateMap.set(on, to);
        } else {
            this._transitionMap.set(
                from,
                (new Map<string, State>()).set(on, to)
            )
        }

        return this;
    }

    public trigger(hookName: string, data = {}): StateMachine {
        this._currentState.trigger(hookName, { ...data, context: this._globalContext });

        return this;
    }

    private _getNextState(event: string, state: State): State {
        const stateMap = this._transitionMap.get(state);
        let next: State;
        if (stateMap) {
            next = stateMap.get(event) as State;
        }

        return next;
    }
}

