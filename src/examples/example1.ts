import { Hook, State } from '../dipper';

export module Example1 {
    export function run() {
        const escape: Hook = {
            name: 'escape',
            action: (state: State) => console.log(` > escaping ${state.name} state`)
        }

        const click: Hook = {
            name: 'click',
            action: (state: State) => console.log(` > reacting to click on ${state.name} state`)
        }

        const initial: State = (new State({ name: 'initial' }))
            .hook({
                name: 'enter',
                action: (state: State) => console.log(` > entering ${state.name} state`)
            })
            .hook({
                name: 'enter',
                action: (state: State) => console.log(` > tell someone else we're entering ${state.name} state`)
            })
            .hook({
                name: 'leave',
                action: (state: State) => console.log(` > leaving ${state.name} state`)
            })
            .hook(click)
            .hook(escape)
            .run('enter');

        const sayHeyOnEnter: State = (new State({
            name: 'talker',
            hooks: [
                {
                    name: 'enter',
                    action: (state: State, helper: { getnum: () => number }) => console.log(` + ${state.name} says: hey.${".".repeat(helper.getnum())}`)
                }
            ]
        }))
            .hook(click, escape);

        const sayByeOnLeave = sayHeyOnEnter
            .extend({ name: 'another talker' })
            .hook(
                {
                    name: 'leave',
                    action: (state: State, person: { name: string }) => console.log(` - ${state.name} says: you know nothing, ${person.name}.`)
                }, {
                    name: 'click',
                    action: (state: State) => console.log(` - another click handler on ${state.name}`)
                }
            )
            .run('enter', { getnum: () => Math.random() * 10 })
            .run('click')
            .run('escape')
            .run('leave', { name: 'jon snow' });


        sayHeyOnEnter
            .run('enter', { getnum: () => Math.random() * 25 })
            .run('click')
            .run('escape')
            .run('leave');


        const sum = (new State({ name: 'sum' }))
            .hook({
                name: 'enter',
                action: (state: State, data: { a: number, b: number }) => data.a + data.b
            });
    }
}

