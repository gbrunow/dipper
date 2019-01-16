import { canReact, Reaction } from './reaction';

export interface StateProperties {
    name: string;
    reactions?: Reaction[];
}

export interface State extends StateProperties {
    reactions: Reaction[];
    add: (...reactions: Reaction[]) => State;
    emit: (event: string, data?: any) => State;
    extend: ({ name }: { name: string }) => State;
}

export const CreateState = ({ name, reactions = [] }: StateProperties) => {
    const state = Object.create({ name, reactions });
    return Object.assign(state, canReact(state), canExtend(state), canEmit(state));
};

export const canEmit = (state: State) => ({
    emit: (event: string, data?: any): State => {
        if (state.reactions) {
            state.reactions
                .filter(r => event === r.event)
                .map(r => r.action(state, data));
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