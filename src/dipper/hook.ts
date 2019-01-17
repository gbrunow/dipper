import { State } from './state';

/**
 * Actions are callbacks used by hooks
 */
export type Action = (state: State, data?: any) => void;

export type Hook = {
    name: string; // enter, leave, escape, click, etc
    action: Action;
}
