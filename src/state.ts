import { Effect, withEffects } from './effect';

export interface StateArgs {
    name: string;
    effects?: Effect[];
}
export interface IState extends StateArgs {
    name: string;
    effects: Effect[];
    addEffect: (effect: Effect) => IState;
}

export const State = ({ name, effects = [] }: StateArgs): any => {
    const state = { name, effects };
    return Object.assign(state, withEffects(state));
};