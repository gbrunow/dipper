/**
 * Actions are callbacks used by hooks
 */
export type Action = (data?: { context?: any, event?: string }) => void;

export type Hook = {
    name: string; // enter, leave, escape, click, etc
    action: Action;
}
