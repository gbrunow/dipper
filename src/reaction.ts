import { State } from './state';

/**
 * Actions are callbacks used by reactions
 */
export type Action = (state: State, data?: any) => void;

/**
 * Reaction defines side effects to a given event
 */
export type Reaction = {
    event: string; // enter, leave, escape, click, etc
    action: Action;
}
