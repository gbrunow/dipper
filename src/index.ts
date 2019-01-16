import { Reaction } from './reaction';
import { State } from './state';

const escape: Reaction = {
    event: 'escape',
    action: (state: State) => console.log(` > escaping ${state.name} state`)
}

const click: Reaction = {
    event: 'click',
    action: (state: State) => console.log(` > reacting to click on ${state.name} state`)
}

const initial: State = (new State({ name: 'initial' }))
    .add({
        event: 'enter',
        action: (state: State) => console.log(` > entering ${state.name} state`)
    })
    .add({
        event: 'enter',
        action: (state: State) => console.log(` > tell someone else we're entering ${state.name} state`)
    })
    .add({
        event: 'leave',
        action: (state: State) => console.log(` > leaving ${state.name} state`)
    })
    .add(click)
    .add(escape);

initial.emit('enter');

const sayHeyOnEnter: State = (new State(
    {
        name: 'talker',
        reactions: [
            {
                event: 'enter',
                action: (state: State, data: { getnum: () => number }) => console.log(` + ${state.name} says: hey.${".".repeat(data.getnum())}`)
            }
        ]
    }))
    .add(click, escape);

const sayByeOnLeave = sayHeyOnEnter
    .extend({ name: 'another talker' })
    .add(
        {
            event: 'leave',
            action: (state: State, data: { person: string }) => console.log(` - ${state.name} says: you know nothing, ${data.person}.`)
        }, {
            event: 'click',
            action: (state: State) => console.log(` - another click handler on ${state.name}`)
        }
    )
    .emit('enter', { getnum: () => Math.random() * 10 })
    .emit('click')
    .emit('escape')
    .emit('leave', { person: 'jon snow' });


sayHeyOnEnter
    .emit('enter', { getnum: () => Math.random() * 25 })
    .emit('click')
    .emit('escape')
    .emit('leave');
