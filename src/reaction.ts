import { StateProperties } from './state';

/**
 * Actions are callbacks used by reactions
 */
export type Action = (state: StateProperties) => void;

/**
 * Reaction defines side effects to a given event
 */
export type Reaction = {
    event: string; // enter, leave, escape, click, etc
    action: Action;
}

export const canReact = (obj: any) => ({
    add: (reaction: Reaction) => {
        obj.reactions.push(reaction);
        return obj;
    }
});
