import { State } from './state';

export interface IStateMachine {
    states: State[];
    initialState: State;
    previousState: State;
    currentState: State;
}

