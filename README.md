# [dipper.js](https://github.com/gbrunow/dipper)

A tiny event-driven finite state machine library for TypeScript/JavaScript.

# Instalation

```shell
npm install dipper.js
```

# Usage

`dipper.js` hadles state management while consolidating a few key concepts: [`states`](#states), [`state machine`](#state-machine), [`events`](#events), [`transitions`](#transitions) and [`hooks`](#hooks).

## States

```javascript
import { State } from 'dipper.js';

const stateOne = new State({ name: 'state one' });

const stateTwo = new State();   // naming states is optional,
                                // it is there to facilitate debugging  
                                // and for future visualization tools
```

## Hooks

Defines state behaviors, most of time the you'll need to setup the hooks `enter` and/or `leave`, which the [`state machine`](#state-machine) executes by default.
Custom hooks will exectuted uppon being triggered through the [`state machine`](#state-machine).

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

This is how to assiciate a [`hook`](#hooks) with a [`state`](#states)

```javascript
import { State, Hook } from 'dipper.js';

const greeter = (new State())
    .hook(sayHiOnEnter)
    .hook(sayByeOnLeave)
    .hook(screamOnEscape);
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

## State Machine

### Basics

```javascript
import { StateMachine } from 'dipper.js';

const stateMachine = new StateMachine();

stateMachine.run({initialState: greeter});
```

## Invoking custom Hooks

```javascript
stateMachine.trigger(`escape`);
```

### Subscriptions

You may use the `subscriptions` attribute to hold any state relevant subscriptions, the [`state machine`](#state-machine) will automatically unsubscribe from them before moving to the next state.

```javascript
const subscription = $someObservable.subscribe(() => {
    // do something
});

stateMachine.subscriptions.add(subscription);
```

### before & after helpers

If you have actions that need to be taken before and/or after every state you may do so by setting the `before()` and `after()` callbacks. Those callbacks also have access to the state machine [`context`](#context)

```javascript
stateMachine.before = (data) => {
    console.log(`about to enter a state`, data);
}

stateMachine.after = (data) => {
    console.log(`just left a state`, data);
}
```

## Transitions

Consider the case of a traffic light that has three [`states`](#states):
- `green`
- `yellow`
- `red`

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

## Passing Data into States

### Local data

```javascript
const greeter = (new State())
    .hook({
        name: 'enter'
        action: (data) => console.log(`hi ${data.personName}`);
    })

...

state.emit('some event', { personName: 'John' }); // hi John
```

### Context

```javascript
const stateMachine = new StateMachine();
stateMachine.context = { country: 'Italy' };

...

const state = (new State())
    .hook({
        name: 'enter'
        action: (data) => console.log(`${data.personName} lives in ${data.context.country}`);
    });

...

state.emit('some event', { personName: 'Jessica' }); // Jessica lives in Italy
```


## Code Sample

- [ng-dipper-sample](https://github.com/gbrunow/ng-dipper-sample)

# TODO:
- Unit Tests
- JSDocs
