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

console.log(initial);
initial.reactions.forEach(e => initial.emit(e.event));
