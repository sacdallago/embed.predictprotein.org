/***
 *
 * The purpose of this file is to expose functions that allow for a certain action (a function) to happen at a delayed point in time.
 *
 * Actions are be rewritable, meaning that: if an action with the same signature is enqueued for execution,
 * it will cancel the execution of the previous enqueued action with the same signature.
 *
 * In other words: it is a collection of single-slot queues.
 */


// Time elapsing in ms before an action is taken
const GLOBAL_TTE = 1000;

let actions = {};


/***
 *
 * @param signature: unique key representing request
 * @param action: a function
 * @param TTE: time to execute in MS
 */
export default function delay(signature, action, TTE) {
    if (actions[signature] !== null) {
        clearTimeout(actions[signature]);
    }

    actions[signature] = setTimeout(() => {
        action()
    }, TTE || GLOBAL_TTE);
}