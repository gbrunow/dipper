import { State } from '../dipper';
import { StateMachine } from '../dipper/state-machine';

export module HelloWorldSM {

    export function run() {
        const h = (new State({ name: 'h' }))
            .hook({ name: 'enter', action: () => h.emit('next', { message: 'h' }) });

        const e = (new State({ name: 'e' }))
            .hook({ name: 'enter', action: (data: { message: string }) => e.emit('next', { message: data.message + 'e' }) });

        const l1 = (new State({ name: 'l1' }))
            .hook({ name: 'enter', action: (data: { message: string }) => l1.emit('next', { message: data.message + 'l' }) });

        const l2 = (new State({ name: 'l2' }))
            .hook({ name: 'enter', action: (data: { message: string }) => l2.emit('next', { message: data.message + 'l' }) });

        const o1 = (new State({ name: 'o1' }))
            .hook({ name: 'enter', action: (data: { message: string }) => o1.emit('next', { message: data.message + 'o' }) });

        const space = (new State({ name: 'space' }))
            .hook({ name: 'enter', action: (data: { message: string }) => space.emit('next', { message: data.message + ' ' }) });

        const w = (new State({ name: 'w' }))
            .hook({ name: 'enter', action: (data: { message: string }) => w.emit('next', { message: data.message + 'w' }) });

        const o2 = (new State({ name: 'o2' }))
            .hook({ name: 'enter', action: (data: { message: string }) => o2.emit('next', { message: data.message + 'o' }) });

        const r = (new State({ name: 'r' }))
            .hook({ name: 'enter', action: (data: { message: string }) => r.emit('next', { message: data.message + 'r' }) });

        const l3 = (new State({ name: 'l3' }))
            .hook({ name: 'enter', action: (data: { message: string }) => l3.emit('next', { message: data.message + 'l' }) });

        const d = (new State({ name: 'd' }))
            .hook({ name: 'enter', action: (data: { message: string }) => d.emit('next', { message: data.message + 'd' }) });

        const print = (new State({ name: 'print' }))
            .hook({ name: 'enter', action: (data: { message: string }) => console.log(data.message) })

        const sm = (new StateMachine())
            .transit({ from: h, to: e, on: 'next' })
            .transit({ from: e, to: l1, on: 'next' })
            .transit({ from: l1, to: l2, on: 'next' })
            .transit({ from: l2, to: o1, on: 'next' })
            .transit({ from: o1, to: space, on: 'next' })
            .transit({ from: space, to: w, on: 'next' })
            .transit({ from: w, to: o2, on: 'next' })
            .transit({ from: o2, to: r, on: 'next' })
            .transit({ from: r, to: l3, on: 'next' })
            .transit({ from: l3, to: d, on: 'next' })
            .transit({ from: d, to: print, on: 'next' });

        sm.run({ initialState: h });

    }
}