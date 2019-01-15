import { canReact, Reaction } from './reaction';

export interface StateProperties {
    name: string;
    reactions?: Reaction[];
}

export interface State extends StateProperties {
    reactions: Reaction[];
    add: (...reactions: Reaction[]) => State;
    emit: (...events: string[]) => State;
    extend: ({ name }: { name: string }) => State;
}

export const canEmit = (state: State) => ({
    emit: (...events: string[]): State => {
        if (state.reactions) {
            state.reactions
                .filter(r => events.some(e => e === r.event))
                .map(r => r.action(state));
        }

        return state;
    }
});

export const canExtend = (state: State) => ({
    extend: ({ name }: { name: string }): State => CreateState({
        name: name || state.name,
        reactions: [...(state.reactions || [])]
    })
});

export const CreateState = ({ name, reactions = [] }: StateProperties) => {
    const state = Object.create({ name, reactions })
    return Object.assign(state, canReact(state), canExtend(state), canEmit(state));
};