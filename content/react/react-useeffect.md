---
id: react-useeffect
lang: React
title: useEffect
override: true
---

# useEffect

## Simplest form

```jsx
// Data shape: (callback, dependency array) -> undefined
// The callback may return a cleanup function. The array holds the values the callback reads.
useEffect(() => {
    document.title = 'Hotels';
    return () => console.log('title effect is leaving');
}, []);
```

## What it is for

`useEffect` runs a function after React has put the render on the screen. It exists so your component can talk to things that are not part of the render: the network, a timer, `window`, a WebSocket, the document title, a third party widget. Rendering must stay pure, so any of those side effects have to leave the render function and wait for the commit. That waiting room is the effect.

The hook takes two arguments. The first is a callback, and it may return a cleanup function. The second is the dependency array. Both matter, and the array is where most exam marks are lost.

## The three shapes of the dependency array

An empty array `[]` means run once after the first render, then never again for the life of that component instance. Use it for work that depends on nothing: one initial load, one subscription, one timer.

An array with values `[id, page]` means run after the first render, then again after any render in which at least one of those values changed. React compares each value with `Object.is`. Same value, no run. Different value, cleanup from the previous run, then the new run.

No array at all means run after every single render. It is legal, it is almost always a bug, and it is a common exam trap. If the effect calls `setState`, the state change renders again, which runs the effect again, which sets state again. The page freezes and the console fills up. When you see "maximum update depth exceeded", look for a missing array first.

`Object.is` compares by reference for objects, arrays and functions. A new `{ page: 1 }` on every render is a different object every time even though it looks the same. A function declared inside the component is a new function every time too. Putting either one in the array makes the effect run on every render, which is the bug you were trying to avoid, only harder to see.

## Every part

The callback runs after the browser has painted in the common case. That is why the warning "can't perform a React state update on an unmounted component" used to appear: the request finished after the paint. React flushes effects in the order they are declared, and in the same order as the hooks in that component. Effects from a parent run after effects from its children.

The cleanup function runs in two situations. Before the effect runs again, and once when the component unmounts. It receives no arguments and its return value is ignored. Whatever you started in the effect, you stop here: `clearInterval`, `clearTimeout`, `removeEventListener`, `controller.abort()`, `socket.close()`, `unsubscribe()`. If the effect started nothing, you do not need a cleanup and you should not add an empty arrow function for decoration.

When the component removes itself, React runs every cleanup in reverse order of declaration. Application state is already frozen at that point, so a `setState` inside a cleanup is a no-op.

Reading a value inside the effect always gives the value from the render that produced that effect. This is the whole point of the dependency array: every value from the component scope that the callback reads belongs in the array. Lint rules call this exhaustive dependencies. Ignoring the rule gives you a stale closure: the effect keeps the first `count` it ever saw and shows `0` forever while the screen says `7`.

The effect must be called at the top level of the component or of another hook. No `if`, no loop, no `try` around it. The hook order has to be identical on every render, or React pairs state with the wrong hook.

## Why the effect runs twice in development

StrictMode mounts a component, runs its effects, runs the cleanups, then runs the effects again. Development only. The reason is to make you notice effects that are not safe to run twice: a double `POST`, a duplicated listener, two overlapping requests, a counter that jumps by two.

The fix is never to remove StrictMode. The fix is to make the effect idempotent. Abort the first request when the second one starts, remove the listener in the cleanup, or ignore the response of an effect run that was already cleaned up. Once the effect survives the double run, it also survives a fast refresh during development, and it survives a real remount in production when the user navigates away and back.

## Fetching data

The usual shape has four states, and the exam checks all of them: loading, error, empty, data. A blank screen with no message reads as a broken app to the person grading it.

Two problems appear as soon as the dependency array can change. The first is the race. The user types `bu`, then `bud`. Request one is slower than request two. Response two arrives, sets the list for `bud`, then response one arrives and overwrites it with the list for `bu`. The screen shows results for a word that is no longer in the input.

Two ways to kill that. The first is a per-run flag. Inside the effect, `let ignore = false;` and the promise callbacks check it. The cleanup sets `ignore = true`, so a run that has been replaced can no longer write state. The variable is local to that effect invocation, which is exactly what you want: each run owns its own flag. The second is `AbortController`, which also stops the request from using bandwidth. Create the controller in the effect, pass `signal` to `fetch`, call `abort()` in the cleanup. The aborted fetch rejects with an error whose `name` is `AbortError`, and that error must not be shown to the user as a failure.

The second problem is the async callback. `useEffect(async () => { ... })` is wrong because an async function returns a Promise, and React expects either nothing or a cleanup function. Declare an inner `async function load()`, call it, and keep the outer callback synchronous. That also keeps the cleanup reachable.

`fetch` does not throw on a 404 or a 500. It resolves with `response.ok === false`. If you only catch network errors, the page renders an empty list instead of an error message, and the bug survives every test until someone opens devtools.

## Subscriptions

Every `addEventListener`, `setInterval`, `setTimeout`, WebSocket, `EventSource` and store subscription opened in an effect needs a matching teardown in the cleanup. Without it the listener stays alive after the component is gone, keeps the closed over state alive with it, and fires `setState` on a component nobody can see. Ten navigations later there are ten listeners and one keystroke runs the handler ten times.

The dependency array for a subscription holds the values the handler reads. If the handler reads `roomId`, put `roomId` in the array. The effect then leaves the old room and joins the new one. An empty array here means the socket stays in the first room forever, which is the sort of bug that looks like a backend problem for two hours.

## Timers

`setInterval` is the classic case. The effect starts it, the cleanup clears it. Two traps. First, a state read inside the interval is frozen at the render that created it, so `setSeconds(seconds + 1)` sticks at `1`; use the functional form `setSeconds(value => value + 1)`, or keep a ref. Second, a `setTimeout` inside an effect that depends on a value which the timeout changes re-creates the timeout on every run, so the callback may never fire if the value changes faster than the delay. Debouncing input is the deliberate version of that behaviour and it is fine; an accidental one is not.

## Derived state

Most of what people put in an effect does not belong there. If a value can be computed from props or state during render, compute it during render. `const total = items.reduce(...)` on the line above the `return` is correct, fast and has no dependency array to get wrong.

The pattern to avoid: copy a prop into state with an effect so you can edit it. The copy is one render behind, it does not update when the prop changes for a reason you did not anticipate, and it doubles the renders. Keep the prop as the source of truth, and keep one piece of state that records the last value you saw if you truly need the "reset on change" behaviour.

The same goes for filtering and sorting a list. Filter in the render, not in an effect that writes to a second state variable.

## When not to use an effect

An event handler is not an effect. A click that posts a booking is `onClick`, not `useEffect` watching a `submitted` flag. An effect that only runs because a flag changed is a handler written the long way around, and it fires again if the component remounts.

Data that a parent already has should arrive as a prop. If you find an effect whose only job is to call `setState` with a value derived from another state, delete the effect and derive the value.

## Examples

### Example 1: keep the document title in sync

```jsx
import { useEffect, useState } from 'react';

// Data shape: { count: number }
function Counter() {
    const [count, setCount] = useState(0);

    // Runs after the first render and after every render where count changed.
    useEffect(() => {
        document.title = `Clicked ${count} times`;
    }, [count]);

    return (
        <button onClick={() => setCount(count + 1)}>
            Clicked {count} times
        </button>
    );
}
```

The effect has no cleanup because it starts nothing. It writes to the document, which is outside React, so it cannot live in the render. Without `[count]` the title would still be correct, but the effect would also run on unrelated renders, and the exam answer would lose the point about dependencies.

### Example 2: a stopwatch that survives unmount

```jsx
import { useEffect, useState } from 'react';

// Data shape: { running: boolean, seconds: number }
function Stopwatch() {
    const [running, setRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!running) {
            return; // no timer to clean up yet
        }

        const id = setInterval(() => {
            // Functional update: the interval never sees a stale seconds value.
            setSeconds(value => value + 1);
        }, 1000);

        return () => clearInterval(id);
    }, [running]);

    return (
        <div>
            <p>{seconds} s</p>
            <button onClick={() => setRunning(!running)}>
                {running ? 'Stop' : 'Start'}
            </button>
            <button onClick={() => { setRunning(false); setSeconds(0); }}>Reset</button>
        </div>
    );
}
```

Pressing Start flips `running`, the effect runs and creates one interval. Pressing Stop flips it back, React runs the cleanup and the interval dies. A conditional `return` before the setup is allowed, because the hook itself is still called on every render; what must stay unconditional is the call to `useEffect`, not the body.

### Example 3: subscribe to the browser network state

```jsx
import { useEffect, useState } from 'react';

// Data shape: online: boolean
function useOnline() {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        function update() {
            setOnline(navigator.onLine);
        }

        window.addEventListener('online', update);
        window.addEventListener('offline', update);

        return () => {
            window.removeEventListener('online', update);
            window.removeEventListener('offline', update);
        };
    }, []);

    return online;
}
```

The listener does not read any component value, so `[]` is honest. `update` is declared inside the effect, which keeps it out of the dependency array. If it were declared in the component body, it would be a new function on every render and `[update]` would resubscribe on every render.

### Example 4: fetch with abort and race protection

```jsx
import { useEffect, useState } from 'react';

// Data shape: hotels = [{ hotel_id, name, city, stars }]
function HotelList({ city }) {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // One controller per run. Abort it when this run is replaced or unmounted.
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError('');

            try {
                const response = await fetch(
                    `/api/hotels?city=${encodeURIComponent(city)}`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                setHotels(data);
            } catch (caught) {
                // An abort is our own doing, not a failure to show the user.
                if (caught.name !== 'AbortError') {
                    setError('Could not load hotels.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => controller.abort();
    }, [city]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (hotels.length === 0) return <p>No hotels in {city}.</p>;

    return (
        <ul>
            {hotels.map(hotel => (
                <li key={hotel.hotel_id}>
                    {hotel.name}, {hotel.city}, {hotel.stars} stars
                </li>
            ))}
        </ul>
    );
}
```

Change `city` fast and every previous request is aborted before it can set state. The `finally` block checks the signal so a cancelled run does not clear the spinner of the run that replaced it. Note the order in the render: loading, error, empty, data.

### Example 5: a full page with search, paging, an interval and a keyboard shortcut

```jsx
import { useEffect, useMemo, useState } from 'react';

// GET /api/hotels?word=&page= -> { items: [{ hotel_id, name, city, stars, price }], total: number }
const PAGE_SIZE = 6;

export default function HotelBrowser() {
    // --- state that the UI shows directly -------------------------------
    const [word, setWord] = useState('');          // raw input, changes on every keystroke
    const [query, setQuery] = useState('');        // debounced copy, drives the request
    const [page, setPage] = useState(1);
    const [hotels, setHotels] = useState([]);      // data shape: [{ hotel_id, name, ... }]
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('idle');  // idle | loading | error | ready
    const [error, setError] = useState('');
    const [tick, setTick] = useState(0);           // seconds since the last successful load
    const [reload, setReload] = useState(0);       // bumped by the Retry button

    // --- effect 1: debounce the input into query -------------------------
    // Without this, one request per keystroke. The cleanup clears the pending timer
    // so only the last keystroke of a burst starts a request.
    useEffect(() => {
        const id = setTimeout(() => {
            setQuery(word.trim());
            setPage(1); // a new search starts at page one, otherwise page 7 shows nothing
        }, 400);

        return () => clearTimeout(id);
    }, [word]);

    // --- effect 2: load data, abort the previous request -----------------
    // Depends on the debounced word, the page and the retry counter, which is exactly
    // the set of values the callback reads.
    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setStatus('loading');
            setError('');

            try {
                const params = new URLSearchParams({
                    word: query,
                    page: String(page),
                    limit: String(PAGE_SIZE),
                });

                const response = await fetch(`/api/hotels?${params}`, {
                    signal: controller.signal,
                });

                // fetch resolves on 404, so check ok before reading the body.
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                setHotels(data.items);
                setTotal(data.total);
                setStatus('ready');
                setTick(0);
            } catch (caught) {
                if (caught.name !== 'AbortError') {
                    setError('Could not load hotels. Check the server.');
                    setStatus('error');
                }
            }
        }

        load();

        // Runs before the next run and on unmount: no response can land out of order.
        return () => controller.abort();
    }, [query, page, reload]);

    // --- effect 3: a one second clock --------------------------------
    // The interval writes only through the functional form, so [] is safe and honest.
    useEffect(() => {
        const id = setInterval(() => setTick(value => value + 1), 1000);
        return () => clearInterval(id);
    }, []);

    // --- effect 4: keyboard paging, resubscribed when page or total changes
    // The handler reads page and pages, so both belong in the array.
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    useEffect(() => {
        function onKey(event) {
            if (event.key === 'ArrowRight' && page < pages) {
                setPage(current => current + 1);
            }
            if (event.key === 'ArrowLeft' && page > 1) {
                setPage(current => current - 1);
            }
        }

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [page, pages]);

    // --- derived values: computed during render, no effect, no state ------
    const cheapest = useMemo(
        () => hotels.reduce((low, hotel) => (hotel.price < low ? hotel.price : low), Infinity),
        [hotels]
    );

    // Retry works by changing a dependency, so the request runs again with the same
    // setup, cleanup and abort guard. A direct load() in the handler would duplicate
    // all of that logic.

    // --- render: every state gets a visible branch ------------------------
    return (
        <section className="hotel-browser">
            <input
                value={word}
                onChange={event => setWord(event.target.value)}
                placeholder="Search hotels"
            />

            {status === 'loading' && <p>Loading page {page}...</p>}
            {status === 'error' && (
                <div className="error">
                    <p>{error}</p>
                    <button onClick={() => setReload(n => n + 1)}>Retry</button>
                </div>
            )}

            {status === 'ready' && hotels.length === 0 && (
                <p>No hotel matches "{query}".</p>
            )}

            {status === 'ready' && hotels.length > 0 && (
                <>
                    <p>
                        {total} hotels, cheapest at {cheapest} EUR. Updated {tick} s ago.
                    </p>
                    <ul>
                        {hotels.map(hotel => (
                            <li key={hotel.hotel_id}>
                                {hotel.name} in {hotel.city}, {hotel.stars} stars
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <div className="pager">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page} of {pages}</span>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>
                    Next
                </button>
            </div>
        </section>
    );
}
```

Four effects, four different dependency arrays, one reason each. The debounce owns a timer and clears it. The loader owns a request and aborts it. The clock owns an interval and clears it. The keyboard listener owns a listener and removes it. Everything else in the component is either a render time calculation or an event handler. That split is the answer the exam is looking for.

## Common mistakes

Calling the effect without a dependency array and setting state inside it. The render loop is immediate and the error message mentions the update depth, not the array.

Leaving out a dependency because the array looked nicer short. The effect then closes over an old value. The symptom is a stale number in the UI, a request for the previous id, or a total that only updates after an unrelated click.

Putting an object, array or inline function in the array. It is a new reference on every render, so the effect runs on every render, and any `setState` inside makes a loop that looks like a dependency problem but is a reference problem.

Writing `useEffect(async () => {...})`. React gets a Promise instead of a cleanup function and warns. Wrap the work in an inner async function.

Forgetting to remove a listener or clear a timer. The effect looks correct in a single visit and leaks on the second.

Handling `AbortError` as a real error. Every navigation flashes "Could not load" for a request the component itself cancelled.

Trusting a fetch that returned 404. `response.ok` is false and `response.json()` may still parse an error body into a shape your render does not expect.

Fetching in an effect when the value was already available as a prop, then copying the prop into state with a second effect. Two effects, one render lag, and a new class of bugs.

Using an effect to react to a click. `useEffect` watching `submitted` fires on remount as well, while `onClick` fires once per click.

Depending on a function defined in the component body without `useCallback`. The subscription is torn down and rebuilt every render, which hides the leak but hammers the server or the socket.

Assuming StrictMode double execution means the code is broken. It means the cleanup is missing or the POST is not idempotent.

## Exam checklist

Can you name the three dependency array shapes and the exact moment each runs?

Can you explain why `[]` freezes the value the effect reads, and what a stale closure looks like on screen?

Does every effect that starts something return a cleanup that stops it, with the same resource (timer id, controller, listener, socket)?

Is every value the callback reads from the component scope listed in the array?

Does the fetch path handle all four states: loading, error, empty, data?

Does the error branch ignore `AbortError`?

Is the async work in an inner function rather than in the effect callback?

Does the component survive StrictMode's mount, cleanup, mount without a duplicated request or a doubled counter?

Are values that can be computed during render computed there instead of stored in state by an effect?

Would a fast change of the dependency (typing, paging) leave the UI showing results for the old value? If yes, the guard is missing.

Is every listener, timer and socket removed on unmount, including the one added on the second visit to the page?
