import { Reaction } from './reaction';

export interface StateProperties {
    name: string;
    reactions?: Reaction[];
}


export class State {
    private _reactions: Reaction[];
    private _name: string;

    constructor({ name, reactions }: StateProperties) {
        this._name = name;
        this._reactions = reactions || [];
    }

    public get name(): string {
        return this._name;
    }

    public add(...reactions: Reaction[]): State {
        this._reactions.push(...reactions);

        return this;
    }

    public emit(event: string, data?: any) {
        this._reactions
            .filter(r => r.event === event)
            .map(r => r.action(this, data));

        return this;
    }

    public extend({ name }: { name: string }) {
        return new State({
            name,
            reactions: [...this._reactions]
        });
    }
}