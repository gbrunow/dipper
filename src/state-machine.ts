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
    private _$currentState: Subject<Context> = new Subject<Context>();

    constructor() { }

    public run({ initialState }: { initialState: State }) {
        this._initialState = initialState;

        this._$currentState.subscribe(ctx => {
            const state = ctx.state;
            state.$event
                .pipe(takeUntil(this._$currentState))
                .subscribe(event => {
                    const next = this._getNextState(event.name, state);
                    if (next) {
                        state.trigger('leave', event.data);
                        this._$currentState.next({ state: next, data: event.data });
                    } else {
                        console.warn(
                            `No transition defined for state "${state.name}" on event "${event.name}"`,
                            { details: { state, event, transitions: this._transitionMap } }
                        );
                    }
                });

            state.trigger('enter', ctx.data);
        });

        this._$currentState.next({ state: this._initialState });
        // this._initialState.trigger('enter');
    }

    public transit({ from, to, on }: TransitionDefinition): StateMachine {

        // this._transitionMap.set(this._transitionToString(on, from), to);

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

    private _getNextState(event: string, state: State): State | undefined {
        const stateMap = this._transitionMap.get(state);
        if (stateMap) {
            return stateMap.get(event) as State;
        }
    }
}

