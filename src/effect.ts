import { StateArgs } from './state';

/**
 * Actions are callbacks used by effects
 */
export type Action = (state: StateArgs) => void;

/**
 * Effect defines reactions to certain events
 */
export type Effect = {
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

// export const withEffects = (obj: any) => ({
//     ...obj,
//     addEffect: (effect: Effect) => {
//         obj.effects.push({
//             event: effect.event,
//             action: () => effect.action(obj)
//         });
//         return obj;
//     }
// });

// export const withEffects = (obj: any) => ({
//     test: () => console.log('test', obj)
// });