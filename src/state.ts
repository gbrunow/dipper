import { canReact, Reaction } from './reaction';

export interface StateProperties {
    name: string;
    reactions?: Reaction[];
}

export interface State extends StateProperties {
    reactions: Reaction[];
    add: (reaction: Reaction) => State;
    emit: (event: string) => void;
}

export const canEmit = (state: StateProperties) => ({
    emit: (event: string) => {
        if (state.reactions) {
            state.reactions
                .filter(r => r.event === event)
                .map(r => r.action(state));
        }
    }
});

export const CreateState = ({ name, reactions = [] }: StateProperties) => {
    const state = {
        name,
        reactions,
    };
    return Object.assign(state, canReact(state), canEmit(state))
};