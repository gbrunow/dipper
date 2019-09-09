export interface ActionContext<G = any, L = any> {
    event?: string;
    global?: G; // state machine context
    local?: L;
}

/**
 * Actions are callbacks used by hooks
 */
export type Action<G = any, L = any> = (data?: ActionContext<G, L>) => void;

export type Hook<G = any, L = any> = {
    name: string; // enter, leave, escape, click, etc
    action: Action<G, L>;
}
