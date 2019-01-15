import { Effect } from './effect';
import { State, StateArgs } from './state';

const escape: Effect = {
    event: 'escape',
    action: (state: StateArgs) => console.log(`escape ${state.name}`)
}

const initial = State({ name: 'initial' })
    .addEffect({
        event: 'enter',
        action: (state: StateArgs) => console.log(`entered ${state.name}`)
    });
// .addEffect({
//     event: 'leave',
//     action: (state: StateArgs) => console.log(`leave ${state.name}`)
// })
// .addEffect(escape);

// initial.effects[0].action({ name: 'initial' });
console.log(initial);
console.log('end');
