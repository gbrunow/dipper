import { State } from './state';

export class StateMachine {
    private _states: State[] = [];
    // initialState: State;
    // previousState: State;
    // currentState: State;
    constructor() { }

    public bind(...states: State[]): StateMachine {
        this._states.push(...states);

        return this;
    }
}

