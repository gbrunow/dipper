# [dipper.js](https://github.com/gbrunow/dipper)

A tiny event-driven finite state machine library for TypeScript/JavaScript.

# Instalation

```shell
npm install dipper.js
```

# Usage

`dipper.js` hadles state management while consolidating a few key concepts: `states`, `state machine`, `events`, `transitions` and `hooks`.

## States

```javascript
import { State } from 'dipper.js';

const stateOne = new State({ name: 'state one' });

const stateTwo = new State();   // naming states is optional,
                                // it is there to facilitate debugging  
                                // and for future visualization tools
```

## Hooks

Defines state behaviors, most of the you'll need to setup the hooks `enter` and/or `leave`, which are exectuded by default.
Custom hooks will exectuted uppon being triggered through the `state machine`.

```javascript
import { Hook } from 'dipper.js';

const sayHiOnEnter: Hook = {
    name: 'enter',
    action: () => {
        console.log('hi');
    }
}

const sayByeOnLeave: Hook = {
    name: 'leave',
    action: () => {
        console.log('bye');
    }
}

const screamOnEscape: Hook {
    name: 'escape',
    action: () => {
        console.log('AAAAAARRRGH');
    }
}
```

## Hooks and States

This is how to assiciate a hook with a state

```javascript
import { State, Hook } from 'dipper.js';

const greeter = (new State())
    .hook(sayHiOnEnter)
    .hook(sayByeOnLeave);
```

or

```javascript
import { State, Hook } from 'dipper.js';

const greeter = (new State())
    .hook({
        name: 'enter',
        action: () => {
            console.log('hi');
        }
    })
    .hook({
        name: 'leave',
        action: () => {
            console.log('bye');
        }
    })
    .hook({
        name: 'escape',
        action: () => {
            console.log('AAAAAARRRGH');
        }
    });
```

## Invoking custom Hooks

```javascript
stateMachine.trigger(`escape`);
```

## State Machine

```javascript
import { StateMachine } from 'dipper.js';

const stateMachine = new StateMachine();

stateMachine.run({initialState: greeter});
```

## Transitions

Consider the case of a traffic light that has three states, `green`, `yellow` and `red`.

```javascript
import { StateMachine } from 'dipper.js';
import { green, red, yellow } from './traffic-light.states';

const stateMachine = (new StateMachine())
    .transit({ from: green, to: yellow, on: 'next' })
    .transit({ from: yellow, to: red, on: 'next' })
    .transit({ from: red, to: green, on: 'next' });

stateMachine.run({ initialState: green });
```

The **event** `next` triggers the transition between states.

## Events

Events can be emitted in two different ways:

- Directly into a state

```javascript
state.emit('event-name');
```

- Into the current state through a state machine

```javascript
stateMachine.emit('event-name');
```

## .emit() vs .trigger()

- `.emit()` will send down an event to a state and may or may not trigger a state transition
- `.trigger()` will execute a state hook

## Code Sample

- [ng-dipper-sample](https://github.com/gbrunow/ng-dipper-sample)

# TODO:
- Unit Tests
