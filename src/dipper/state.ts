import { Hook } from './hook';

export interface StateProperties {
    name: string;
    hooks?: Hook[];
}


export class State {
    private _hooks: Hook[];
    private _name: string;

    constructor({ name, hooks }: StateProperties) {
        this._name = name;
        this._hooks = hooks || [];
    }

    public get name(): string {
        return this._name;
    }

    public hook(...hooks: Hook[]): State {
        this._hooks.push(...hooks);

        return this;
    }

    public run(hookName: string, data = {}) {
        this._hooks
            .filter(r => r.name === hookName)
            .map(r => r.action(this, data));

        return this;
    }

    public emit(event: string, data = {}) {

    }

    /**
     * Creates a new state based on the current hooks
     * @param properties properties of the extended state
     */
    public extend({ name, hooks }: StateProperties) {
        return new State({
            name,
            hooks: [...this._hooks, ...(hooks || [])]
        });
    }
}