import { StateArgs } from './state';

/**
 * Actions are callbacks used by effects
 */
export type Action = (state: StateArgs) => void;

/**
 * Effect defines reactions to certain events
 */
export interface Effect {
    event: string; // enter, leave, escape, click, etc
    action: Action;
}

export const withEffects = (obj: any) => ({
    addEffect: (effect: Effect) => {
        obj.effects.push({
            event: effect.event,
            action: () => effect.action(obj)
        });
        return obj;
    }
});