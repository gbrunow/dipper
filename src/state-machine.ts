import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ActionContext } from './hook';
import { State } from './state';

export interface TransitionDefinition<G = any> {
    from: State<G>;
    to: State<G>;
    on: string;
}

export interface StateMachineContext<G = any> {
    state: State<G>;
    event?: string;
    previous?: State<G>;
    data?: G;
}

export class StateMachine<G = any> {
    private _transitionMap: Map<State<G>, Map<string, State<G>>> = new Map<State<G>, Map<string, State<G>>>();
    private _initialState!: State<G>;
    private _currentState!: State<G>;
    private _$currentContext: Subject<StateMachineContext<G>> = new Subject<StateMachineContext<G>>();
    private _globalContext: G;

    public subscriptions: Subscription = new Subscription();
    public before: (data: ActionContext<G>) => void = () => { };
    public after: (data: ActionContext<G>) => void = () => { };

    constructor() { }

    public get state(): State<G> {
        return this._currentState;
    }

    public get context(): G {
        return this._globalContext;
    }

    public set context(context: G) {
        this._globalContext = context;
    }

    public run({ initialState }: { initialState: State<G> }) {
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
                        this._removeSubscriptions();

                        const data = { ...event.data, context: this._globalContext }

                        state.trigger('leave', data);
                        this.after(data);

                        this._$currentContext.next({ state: next, event: event.name, previous: state, data });
                    } else {
                        console.warn(
                            `No transition defined for state "${state.name}" on event "${event.name}"`,
                            { details: { state, event, transitions: this._transitionMap } }
                        );
                    }
                });

            const data = { local: { ...ctx.data }, global: this._globalContext };
            this.before(data);
            state.trigger('enter', data);
        });

        this._$currentContext.next({ state: this._initialState });
    }

    public transit({ from, to, on }: TransitionDefinition<G>): StateMachine<G> {

        const stateMap = this._transitionMap.get(from);
        if (stateMap) {
            stateMap.set(on, to);
        } else {
            this._transitionMap.set(
                from,
                (new Map<string, State<G>>()).set(on, to)
            )
        }

        return this;
    }

    public trigger(hookName: string, data: any = {}): StateMachine<G> {
        this._currentState.trigger(hookName, {
            global: this._globalContext,
            local: data,
        });

        return this;
    }

    public emit(event: string, data: any = {}): StateMachine<G> {
        this._currentState.emit(event, {
            local: data,
            global: this._globalContext,
            event,
            previous: this._currentState
        });

        return this;
    }

    private _getNextState(event: string, state: State<G>): State<G> {
        const stateMap = this._transitionMap.get(state);
        let next: State<G>;
        if (stateMap) {
            next = stateMap.get(event) as State<G>;
        }

        return next;
    }

    private _removeSubscriptions(): void {
        this.subscriptions.unsubscribe();
        this.subscriptions = new Subscription();
    }
}

