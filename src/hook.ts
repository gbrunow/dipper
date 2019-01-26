/**
 * Actions are callbacks used by hooks
 */
export type Action = (data?: Object) => void;

export type Hook = {
    name: string; // enter, leave, escape, click, etc
    action: Action;
}
