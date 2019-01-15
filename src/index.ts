import { Reaction } from './reaction';
import { CreateState, State, StateProperties } from './state';

const escape: Reaction = {
    event: 'escape',
    action: (state: StateProperties) => console.log(` > escaping ${state.name} state`)
}

const click: Reaction = {
    event: 'click',
    action: (state: StateProperties) => console.log(` > reacting to click on ${state.name} state`)
}

const initial: State = CreateState({ name: 'initial' })
    .add({
        event: 'enter',
        action: (state: StateProperties) => console.log(` > entering ${state.name} state`)
    })
    .add({
        event: 'enter',
        action: (state: StateProperties) => console.log(` > tell someone else we're entering ${state.name} state`)
    })
    .add({
        event: 'leave',
        action: (state: StateProperties) => console.log(` > leaving ${state.name} state`)
    })
    .add(click)
    .add(escape);

initial.emit(...initial.reactions.map(r => r.event));

const sayHeyOnEnter: State = CreateState({
    name: 'talker', reactions: [{
        event: 'enter',
        action: (state: StateProperties) => console.log(`${state.name} says: hey.`)
    }]
}).add(click, escape);

const sayByeOnLeave = sayHeyOnEnter
    .extend()
    .add(
        {
            event: 'leave',
            action: (state: StateProperties) => console.log(`${state.name} says: bye.`)
        }, {
            event: 'click',
            action: (state: StateProperties) => console.log(`another click handler on ${state.name}`)
        }
    )
    .emit('enter')
    .emit('click', 'escape')
    .emit('leave');

sayHeyOnEnter
    .emit('enter')
    .emit('click', 'escape')
    .emit('leave');
