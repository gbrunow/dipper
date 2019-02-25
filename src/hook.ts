export interface ActionContext {
    context?: any,
    event?: string
}
/**
 * Actions are callbacks used by hooks
 */
export type Action = (data?: ActionContext) => void;

export type Hook = {
    name: string; // enter, leave, escape, click, etc
    action: Action;
}
