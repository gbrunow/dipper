import { StateProperties } from './state';

/**
 * Actions are callbacks used by reactions
 */
export type Action = (state: StateProperties, data?: any) => void;

/**
 * Reaction defines side effects to a given event
 */
export type Reaction = {
    event: string; // enter, leave, escape, click, etc
    action: Action;
}

export const canReact = (obj: any) => ({
    add: (...reactions: Reaction[]) => {
        obj.reactions.push(...reactions);
        return obj;
    }
});
