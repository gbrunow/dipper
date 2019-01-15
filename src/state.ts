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

export const State = ({ name, effects = [] }: StateArgs): IState => {
    const state = { name, effects };
    return Object.assign({}, withEffects(state), state);
};