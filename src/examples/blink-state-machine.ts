import { State, StateMachine } from '../dipper';

export module BlinkStateMachine {
    export function run() {
        function turn(on: boolean) {
            const light = on ? '💡' : ' ';
            process.stdout.write(`blink state machine example: ${light} \r`);
        }


        const on = (new State())
            .hook({
                name: 'enter',
                action: () => {
                    turn(true);
                    setTimeout(() => on.emit('turn off'), 500);
                }
            });

        let count = 0;

        const off = (new State())
            .hook({
                name: 'enter',
                action: () => {
                    turn(false);
                    setTimeout(() => off.emit(count++ < 20 ? 'turn on' : 'shut down'), 500);
                }
            });

        const end = (new State())
            .hook({
                name: 'enter',
                action: () => process.stdout.write('\nblink state machine example finished. ✔️\r\n')
            });

        const stateMachine = (new StateMachine())
            .transit({ from: on, to: off, on: 'turn off' })
            .transit({ from: on, to: end, on: 'shut down' })
            .transit({ from: off, to: on, on: 'turn on' })
            .transit({ from: off, to: end, on: 'shut down' });

        stateMachine.run({ initialState: on });
    }

}