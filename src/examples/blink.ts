import { State } from '../dipper';

export module BlinkExample {
    export function run() {
        function turn(on: boolean) {
            const light = on ? '💡' : ' ';
            // process.stdout.clearLine();
            // process.stdout.cursorTo(0);
            process.stdout.write(`blink example: ${light} \r`);
            // console.log(`blink: ${light}`);
        }

        const on = (new State({ name: 'on' }))
            .hook({
                name: 'enter',
                action: () => turn(true)
            });

        const off = (new State({ name: 'off' }))
            .hook({
                name: 'enter',
                action: () => turn(false)
            });

        const end = (new State({ name: 'end' }))
            .hook({
                name: 'enter',
                action: () => process.stdout.write('\nblink example finished. ✔️\r\n')
            })


        let count = 0;
        let isOn = false;

        const timer = setInterval(() => {
            if (isOn) {
                on.run('enter');
            } else {
                off.run('enter');
            }

            isOn = !isOn;
            count++;
            if (count === 20) {
                clearInterval(timer);
                end.run('enter');
            }
        }, 500);
    }
}