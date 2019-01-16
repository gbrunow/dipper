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
        action: (state: StateProperties) => {
            console.log(` > entering ${state.name} state`);
        }
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

const sayHeyOnEnter: State = CreateState({
    name: 'talker', reactions: [{
        event: 'enter',
        action: (state: StateProperties, data: { getnum: () => number }) => console.log(` + ${state.name} says: hey.${".".repeat(data.getnum())}`)
    }]
}).add(click, escape);

const sayByeOnLeave = sayHeyOnEnter
    .extend({ name: 'another talker' })
    .add(
        {
            event: 'leave',
            action: (state: StateProperties, data: { person: string }) => console.log(` - ${state.name} says: you know nothing, ${data.person}.`)
        }, {
            event: 'click',
            action: (state: StateProperties) => console.log(` - another click handler on ${state.name}`)
        }
    )
    .emit('enter', { getnum: () => Math.round(Math.random() * 10) })
    .emit('click')
    .emit('escape')
    .emit('leave', { person: 'jon snow' });

initial.emit('enter');

sayHeyOnEnter
    .emit('enter', { getnum: () => Math.round(Math.random() * 25) })
    .emit('click')
    .emit('escape')
    .emit('leave');
