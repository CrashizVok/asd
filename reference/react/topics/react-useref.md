# useRef

React topic · Exam Wiki

## Simplest form

```jsx
// Data shape: { current: null }
// The same object comes back on every render of this component.
import { useRef } from "react";

function Demo() {
    const boxRef = useRef(null);

    return <div ref={boxRef}>Hello</div>;
}
```

`useRef` returns a small object with one property, `current`. React creates that object on the first render and hands the same object back on every later render. Writing to `current` changes the object, not the screen.

## What it does

A ref is a box that belongs to one component instance. The box has two uses, and both come from the same fact: the box survives renders while everything inside the function body is rebuilt.

The first use is a pointer to a DOM node. You put `ref={boxRef}` on an element, and after React inserts that element into the page it stores the node in `boxRef.current`. From an event handler or an effect you can then call browser methods on it, such as `focus()`, `scrollIntoView()`, or `play()`.

The second use is a place to keep a value that must not reset between renders but must not trigger a render either. A timer id, a flag that says a request already started, the previous value of a prop, an animation frame handle, or a counter for a debugging log all fit here.

A ref is not state. React does not watch it, does not compare it, and does not schedule work when it changes. That is the whole point, and it is also the source of most mistakes around it.

## Every part

### The returned object

`useRef(initialValue)` returns an object shaped like `{ current: initialValue }`. React stores this object in the component's fiber, next to the hook state. On the next render, `useRef` ignores its argument and returns the stored object.

The object identity never changes for the life of the component. That stability is useful: you can pass the ref object to a child, keep it in a dependency array, or close over it in a callback without worrying that it becomes a different object.

### current

`current` is a normal writable property. React writes to it when a DOM node mounts or unmounts. Your code writes to it for timers and flags. Your code reads it in event handlers, effects, and callbacks.

Three facts about `current` matter in practice.

React sets it to the node after the render is committed, not during the render. On the first render it is still `null`, so reading it in the component body gives you nothing useful.

React sets it back to `null` when the node leaves the page or when the element receives a different ref. Code that runs later, such as a timeout, must check again instead of trusting an old value.

Writing it never re-renders. If the screen must show the new value, keep that value in state.

### The initial value

The argument is evaluated on every render, but React only uses the result on the first one. This has two consequences.

An expensive call in the argument runs on every render and the result is thrown away:

```jsx
// Wrong: buildIndex() runs on every render, only the first result is kept.
const indexRef = useRef(buildIndex(rows));
```

Create it lazily instead:

```jsx
// Right: buildIndex() runs once, on the first render that needs it.
const indexRef = useRef(null);
if (indexRef.current === null) {
    indexRef.current = buildIndex(rows);
}
```

This lazy assignment is the accepted exception to the rule against touching refs during render. Keep it deterministic and free of side effects. Do not use the same trick to start a request, subscribe to something, or write to the DOM, because React may render a component more than once and discard the result.

A function passed as the initial value is stored as a function. `useRef(() => 1)` gives you `{ current: [Function] }`, not `{ current: 1 }`. `useState` treats a function argument as a lazy initializer; `useRef` does not.

### Stable identity across renders

```jsx
function Probe() {
    const ref = useRef(0);
    const first = useRef(ref);

    console.log(ref === first.current); // true on every render
    return null;
}
```

The log is always `true`. A ref created in a parent and passed down stays the same object, which is why a child can write into a parent's ref without any extra wiring.

### Rules of hooks still apply

Call `useRef` at the top level of a component or another hook. Do not call it inside a condition, a loop, or a nested function. The hook order must be identical on every render. If you need a ref only for a branch, create it unconditionally and ignore it when the branch is off.

### useRef, useState, and a local variable

A local `let count = 0` is recreated on every render, so it loses its value immediately.

`useState` survives renders, but the setter schedules a render and the new value appears only after React finishes the current work. It is the right tool for anything the user sees.

`useRef` survives renders, updates immediately, and renders nothing. It is the right tool for browser nodes and for values that support the UI without appearing in it.

The common combination is both at once: state holds the number on screen, a ref holds the timer that changes it.

## DOM refs

```jsx
const inputRef = useRef(null);

return (
    <>
        <input ref={inputRef} />
        <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
);
```

React fills `inputRef.current` with the input element after the commit. The optional chaining guard is not decoration: click handlers can run after the input was removed, and the ref is `null` at that point.

Do not read or write `ref.current` in the component body to change the page. During render the node may be missing, and under concurrent rendering React can render a component without committing it. Use an effect for work that must happen after the node exists.

React owns the node it created. Setting styles, focus, scroll position, or playback is fine. Replacing its children, rewriting its text, or removing nodes that React also renders causes React to lose track of the DOM and produces hard-to-find errors.

### A ref on your own component

On a host element such as `input`, `div`, or `video`, `ref` is special and React handles it. On a function component, `ref` is not a normal prop in React 18, so this does nothing useful:

```jsx
// Wrong on React 18: FancyInput ignores ref, and React warns.
<FancyInput ref={inputRef} />
```

You have two fixes. In React 19, accept `ref` as a prop:

```jsx
// React 19
function FancyInput({ ref, ...rest }) {
    return <input ref={ref} {...rest} />;
}
```

In React 18, or in code that must run on both, wrap the component in `forwardRef`. The section on ref forwarding later shows the full pattern.

### When current is null

`current` is `null` before the first commit, while the element is conditionally hidden, and after unmount. A ref does not keep a removed node alive, and React clears it as part of the cleanup. Always read the ref at the moment you need it and handle `null` there. Copying `ref.current` into a variable at the top of a component and using it in a timeout is a common way to hold a stale node.

## Mutable values

A ref is the closest thing React has to an instance field on a class component.

```jsx
function SearchForm() {
    const requestIdRef = useRef(0);

    async function search(term) {
        const id = requestIdRef.current + 1;
        requestIdRef.current = id;

        const response = await fetch(`/api/hotels?city=${encodeURIComponent(term)}`);
        const rows = await response.json();

        // A newer search started while this one was waiting.
        if (requestIdRef.current !== id) return;

        console.log(rows);
    }

    return <input onChange={(event) => search(event.target.value)} />;
}
```

The request id does not belong in state. Nothing about it should appear on screen, and putting it in state would cause a render for every keystroke. The ref gives each request a ticket, and the comparison at the end drops answers that arrived out of order.

The same pattern covers "has this effect already run", "is the component still mounted", and "which row was open before". The value is invisible to React, which is exactly what these cases need.

## Why there is no re-render

React re-renders when state changes, when a parent renders, or when a context value changes. It does not scan objects for changed properties. `ref.current = 5` is an ordinary JavaScript assignment; React never sees it.

That gives you two rules.

Use a ref when the value supports behavior: a node to focus, a timer to clear, an id to compare, a previous value to display on the next render anyway.

Use state when the value changes what the user sees now. A counter shown on screen must be state. A ref can mirror it for a timer, but the state is what draws.

Writing a ref and then calling a state setter in the same handler is normal. The state setter causes the render, and the ref is already updated when that render happens.

## Timer IDs

The classic use is `setInterval`. The id is a number in the browser environment, and it must survive renders so the same interval can be cleared later.

```jsx
function Stopwatch() {
    const timerRef = useRef(null);
    const startedAtRef = useRef(0);
    const [elapsed, setElapsed] = useState(0);

    function start() {
        if (timerRef.current !== null) return; // already running

        startedAtRef.current = Date.now() - elapsed;
        timerRef.current = setInterval(() => {
            setElapsed(Date.now() - startedAtRef.current);
        }, 100);
    }

    function stop() {
        if (timerRef.current === null) return;

        clearInterval(timerRef.current);
        timerRef.current = null; // prevent a second clear and allow a restart
    }

    useEffect(() => stop, []); // clear when the component leaves the page

    return (
        <>
            <p>{(elapsed / 1000).toFixed(1)} s</p>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
        </>
    );
}
```

`elapsed` is state because the number is on screen. The interval id and the start timestamp are refs because they are plumbing. Resetting the id to `null` after clearing is not cosmetic: it keeps `start` from creating a second interval and it keeps the cleanup from clearing an id that may already belong to something else.

Use `setTimeout` the same way when the timeout is long lived, and clear it in an effect cleanup or in the handler that cancels the action.

## Previous values

A ref can hold the value from the last render while the current render uses the new one.

```jsx
function usePrevious(value) {
    const previousRef = useRef(undefined);

    useEffect(() => {
        previousRef.current = value;
    }, [value]);

    return previousRef.current;
}
```

The effect runs after the render. During that render, `previousRef.current` still holds the value from the render before, so the caller sees the old value and the new value side by side. On the first render it is `undefined`, which is honest: there is no previous value yet.

Do not update this ref in the component body to get the value one render earlier. A write during render can run twice under StrictMode, and concurrent rendering can discard the render entirely, leaving the ref holding a value that was never shown.

## Focus

Focus is the most common DOM ref task.

```jsx
function SearchBox({ error }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (error) inputRef.current?.focus();
    }, [error]);

    return <input ref={inputRef} aria-invalid={Boolean(error)} />;
}
```

The effect runs after React has attached the node, so the call is safe. The dependency on `error` means the field is focused again when a new error appears, which is what a user needs after a failed submit.

For the first mount only, an empty dependency array works. `autoFocus` on the input is simpler when nothing else must happen, but a ref gives you control over timing and lets you focus a field that appears later.

If the field is rendered conditionally, the effect that runs when the condition turns true is the place to focus. Do not read the ref before the node exists, and do not assume the node is still there when a delayed callback fires.

For a list of inputs, keep refs in an array or a `Map` and focus by index. A single ref cannot point at several nodes.

## Scroll

`scrollIntoView` on a ref moves an element into the visible part of the page or of a scrollable parent.

```jsx
function Chat({ messages }) {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: "end" });
    }, [messages.length]);

    return (
        <div className="chat">
            {messages.map((message) => (
                <p key={message.id}>{message.text}</p>
            ))}
            <div ref={endRef} />
        </div>
    );
}
```

The marker div at the end is a ref target that costs nothing and gives a precise scroll anchor. A ref to the container works too, with `container.scrollTop = container.scrollHeight`. That form is useful when you also need to read `scrollHeight` or decide whether the user was already at the bottom before the new message arrived.

If the scroll must happen before the browser paints, use `useLayoutEffect`. It runs after the DOM is updated and before the frame is shown, so the user does not see the list jump. With images or fonts that load later, the height can change after the effect; a `ResizeObserver` on the content, or the `scrollend` event on the container, handles that case.

For a one time jump to a section, a click handler is enough:

```jsx
sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
```

## Video

A `<video>` element is a stateful browser object, so React does not control it the way it controls an input value. The ref is the bridge.

```jsx
function Clip({ src }) {
    const videoRef = useRef(null);

    async function play() {
        try {
            await videoRef.current?.play();
        } catch (error) {
            // Autoplay was blocked, or the source is not ready yet.
            console.log("play failed", error.name);
        }
    }

    return (
        <>
            <video ref={videoRef} src={src} muted playsInline />
            <button onClick={play}>Play</button>
            <button onClick={() => videoRef.current?.pause()}>Pause</button>
            <button
                onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime = 0;
                }}
            >
                Restart
            </button>
        </>
    );
}
```

`play()` returns a promise. Browsers reject it when the video is not loaded or when autoplay policy blocks sound. Catch the rejection; an unhandled one shows up as an error in the console and teaches nothing.

Progress usually comes from the `onTimeUpdate` event or from `requestAnimationFrame` while the video plays. Reading `video.currentTime` and `video.duration` in those callbacks and putting the result in state is fine. Do not write the progress into the video element from React on every render, because that fights the browser's own playback clock.

`requestFullscreen()` on the video element or on a wrapper is another ref task. It must be called from a user gesture in most browsers, so call it in the click handler, not in an effect.

## Callback refs

The `ref` prop also accepts a function. React calls it with the node when the node is attached and with `null` when it is removed.

```jsx
function MeasuredBox() {
    const [height, setHeight] = useState(0);

    // Stable identity, so React does not detach and reattach on every render.
    const measure = useCallback((node) => {
        if (!node) return;
        setHeight(node.getBoundingClientRect().height);
    }, []);

    return (
        <>
            <div ref={measure} className="box">Content</div>
            <p>Height: {height} px</p>
        </>
    );
}
```

A callback ref runs at commit time, after the node exists. Reading layout there is safe, and calling `setHeight` schedules a render with the measurement, which is a normal and supported pattern.

An inline arrow creates a new function on every render. React sees a different ref, calls the old one with `null`, then calls the new one with the node. That is harmless for a measurement but expensive for a subscription, and it can cause an infinite loop when the callback sets state. Wrap it in `useCallback`, or define the function outside the component when it needs no props.

In React 19 a callback ref may return a cleanup function. Returning a value by accident turns an assignment into a cleanup:

```jsx
// Wrong: the arrow returns the node, and React treats the return value as cleanup.
<div ref={(node) => (nodeRef.current = node)} />

// Right: a block body returns undefined.
<div ref={(node) => { nodeRef.current = node; }} />
```

For several nodes, write into a `Map` keyed by id:

```jsx
const nodesRef = useRef(new Map());

const register = (id) => (node) => {
    if (node) nodesRef.current.set(id, node);
    else nodesRef.current.delete(id);
};
```

Each call to `register(id)` creates a new function, so use it only when the list changes rarely, or memoize it per row.

## useImperativeHandle

Sometimes a parent must call a method on a child, for example `focus()` on a custom input or `play()` on a player. Props flow down, so the usual answer is a callback prop. When the parent needs a handle instead, `useImperativeHandle` defines exactly what the parent may call.

```jsx
import { forwardRef, useImperativeHandle, useRef } from "react";

const FancyInput = forwardRef(function FancyInput(props, ref) {
    const inputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus() {
            inputRef.current?.focus();
        },
        clear() {
            if (inputRef.current) inputRef.current.value = "";
        },
    }), []);

    return <input ref={inputRef} {...props} />;
});
```

The parent gets an object with `focus` and `clear`, not the DOM node. That is the point: the child keeps control of its markup and can change the internals without breaking the parent. Keep the exposed surface small. A handle with ten methods is a sign that the state should be lifted or passed as props.

The dependency array works like the one in `useMemo`. If the handle reads a prop, list that prop so the parent receives a fresh handle when it changes. An empty array is correct when every method reads only refs.

## Ref forwarding

Before React 19, `ref` was not passed to function components as a prop. `forwardRef` opts in:

```jsx
import { forwardRef, useRef } from "react";

const TextField = forwardRef(function TextField({ label, ...rest }, ref) {
    return (
        <label>
            {label}
            <input ref={ref} {...rest} />
        </label>
    );
});

TextField.displayName = "TextField";
```

The inner `ref` is the one from the parent. Spreading `rest` does not forward it, because `ref` was never in props. Name the component in the wrapper or set `displayName`; otherwise DevTools shows `ForwardRef` and stack traces get vague.

In React 19, `ref` is an ordinary prop for function components, so the same component can be written without the wrapper:

```jsx
function TextField({ label, ref, ...rest }) {
    return (
        <label>
            {label}
            <input ref={ref} {...rest} />
        </label>
    );
}
```

`forwardRef` still works in React 19 and is the portable choice when the project may run on 18. Do not forward a ref to a DOM node that the child does not own, and do not forward it through several layers unless each layer genuinely passes the same node down. Deep ref chains are hard to follow; a context or a callback prop is often clearer.

## StrictMode

In development, StrictMode renders each component twice and mounts, unmounts, and remounts every effect once. This is deliberate: it surfaces effects that are not safe to run twice.

For refs, the visible effects are these.

The ref object from the discarded first render is thrown away. The initializer runs twice, so an expensive or side effecting initializer runs twice. Keep initializers pure and cheap, or use the lazy pattern.

An effect that starts an interval without a cleanup leaves two intervals running, and the stopwatch counts at double speed. The bug was always there; StrictMode only makes it visible. The fix is the cleanup function, not removing StrictMode.

Callback refs are detached and reattached during the extra mount cycle. A callback that subscribes must return a cleanup or handle the `null` call correctly.

Timers started in an event handler are not affected, because StrictMode only re-runs renders and effects, not clicks.

Production builds do not double invoke. Code that only works with StrictMode off will still fail when a real remount happens, for example when a route changes and the component is reused.

## Server rendering

`useRef` itself is safe on the server. The object is created, `current` keeps its initial value, and no effect runs. A DOM ref stays `null` because there is no DOM to attach to. Do not read DOM refs during render on the server, and do not branch on `ref.current` to decide markup. After hydration, React attaches the nodes and runs the effects in the browser.

## Cleanup

React clears a DOM ref for you when the node unmounts, but it does not clear the work you started around that node. Timers, animation frames, event listeners, observers, and media playback all need an explicit cleanup.

```jsx
useEffect(() => {
    const id = setInterval(() => {
        // work
    }, 1000);

    return () => {
        clearInterval(id);
    };
}, []);
```

Three details make a cleanup reliable.

Return it from the same effect that created the resource, so it runs on unmount and before the effect runs again with new dependencies.

Make it safe to run twice. StrictMode runs it once in development during the extra mount cycle, and a dependency change can run it again in production.

Reset the ref when the resource is gone. An interval id left in `ref.current` after `clearInterval` invites a second clear on an id the browser may have reused. Set it to `null`, and for animation frames set it to `0`.

For a ref that points at a node, do not try to keep the node alive yourself. Copy what you need from it before cleanup, and read the ref again after any `await`.

## Examples

### Example 1: focus, a mutable counter, and proof that refs do not render

```jsx
import { useEffect, useRef, useState } from "react";

function SearchBox() {
    const inputRef = useRef(null);
    const clicksRef = useRef(0);
    const [renders, setRenders] = useState(0);

    // Runs after the input is in the page, so focus() has a node to work with.
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function handleClick() {
        clicksRef.current += 1;
        console.log("clicks so far:", clicksRef.current);
    }

    function handleEscape(event) {
        if (event.key !== "Escape") return;

        event.currentTarget.value = "";
        inputRef.current?.focus();
    }

    return (
        <section>
            <input
                ref={inputRef}
                placeholder="Search hotels"
                onKeyDown={handleEscape}
            />
            <button onClick={handleClick}>Log a click</button>

            {/* This button is the only thing that re-renders the component. */}
            <button onClick={() => setRenders((value) => value + 1)}>
                Force a render
            </button>

            {/*
                clicksRef.current changes on every click, but the number below
                only updates when a render happens for another reason. That is
                the visible difference between a ref and state.
            */}
            <p>Renders: {renders}</p>
            <p>Clicks stored in the ref: {clicksRef.current}</p>
        </section>
    );
}

export default SearchBox;
```

The input is focused on mount. Escape clears it and returns focus without touching state. The click counter lives in a ref because nothing needs to redraw when it changes; the render counter is state because it is displayed. Reading `clicksRef.current` in JSX is acceptable for a debug line, but it explains why the number looks stale until the next render.

### Example 2: interval id, drift, and cleanup

```jsx
import { useEffect, useRef, useState } from "react";

function Stopwatch() {
    // Data shape: null or a number returned by setInterval.
    const intervalRef = useRef(null);
    // Data shape: a timestamp in milliseconds.
    const startRef = useRef(0);
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);

    function start() {
        if (intervalRef.current !== null) return;

        // Subtract elapsed so a pause and resume does not jump back to zero.
        startRef.current = Date.now() - elapsed;

        intervalRef.current = setInterval(() => {
            // Date.now() keeps the clock honest even if a tick is late.
            setElapsed(Date.now() - startRef.current);
        }, 100);

        setRunning(true);
    }

    function stop() {
        if (intervalRef.current === null) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null; // a later stop must not clear a reused id
        setRunning(false);
    }

    function reset() {
        stop();
        setElapsed(0);
    }

    // One cleanup for both unmount and StrictMode's extra mount cycle.
    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    return (
        <section>
            <p>{(elapsed / 1000).toFixed(1)} s</p>
            <button onClick={start} disabled={running}>Start</button>
            <button onClick={stop} disabled={!running}>Stop</button>
            <button onClick={reset}>Reset</button>
        </section>
    );
}

export default Stopwatch;
```

The interval id is a ref, not state, because changing it must not redraw anything. The elapsed time is state because it is on screen. The start timestamp is a ref for the same reason as the id, and subtracting it from `Date.now()` prevents the drift that accumulates when a callback increments a number every tick. The cleanup checks for `null` first so it can run twice without clearing an id that no longer belongs to this component.

### Example 3: previous value and a change counter

```jsx
import { useEffect, useRef, useState } from "react";

function usePrevious(value) {
    const previousRef = useRef(undefined);

    // The effect runs after the render that used the new value.
    useEffect(() => {
        previousRef.current = value;
    }, [value]);

    return previousRef.current;
}

function CityFilter({ hotels }) {
    const [city, setCity] = useState("");
    const previousCity = usePrevious(city);
    const changesRef = useRef(0);

    // Ref writes are fine in an event handler.
    function handleChange(event) {
        if (event.target.value !== city) changesRef.current += 1;
        setCity(event.target.value);
    }

    const visible = hotels.filter((hotel) =>
        hotel.city.toLowerCase().includes(city.trim().toLowerCase())
    );

    return (
        <section>
            <input value={city} onChange={handleChange} placeholder="City" />

            <p>
                Current: {city || "(empty)"} / Previous: {previousCity ?? "(none)"}
            </p>
            <p>Changes: {changesRef.current}</p>
            <p>{visible.length} hotel(s) match</p>
        </section>
    );
}

export default CityFilter;
```

`usePrevious` returns `undefined` on the first render, then the value from the render before. The change counter is a ref because it is diagnostic and does not need to force a render; it still updates on the next render caused by `setCity`. The filter is derived during render from `city` and `hotels`, which is correct: no ref and no effect needed.

### Example 4: scroll to the newest message and collect rows with callback refs

```jsx
import { useCallback, useEffect, useRef } from "react";

function MessageList({ messages }) {
    // Marker at the end of the list, used as the scroll target.
    const endRef = useRef(null);
    // Data shape: a Map of row id to DOM node, filled by callback refs.
    const rowRefs = useRef(new Map());

    const registerRow = useCallback((id) => (node) => {
        if (node) rowRefs.current.set(id, node);
        else rowRefs.current.delete(id);
    }, []);

    // Scroll after the new message is in the DOM, not before it.
    useEffect(() => {
        endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }, [messages.length]);

    function scrollToRow(id) {
        rowRefs.current.get(id)?.scrollIntoView({ block: "center" });
    }

    return (
        <div className="message-list">
            {messages.map((message) => (
                <article
                    key={message.id}
                    ref={registerRow(message.id)}
                    onClick={() => scrollToRow(message.id)}
                >
                    {message.text}
                </article>
            ))}

            <div ref={endRef} />
        </div>
    );
}

export default MessageList;
```

Two ref patterns share one component. `endRef` is a plain DOM ref used after every new message. `rowRefs` is a `Map` filled by callback refs, which lets a click find a specific row without searching the DOM. The outer `registerRow` is stable, but each call still builds a new callback for React, so rows detach and reattach on every render. That is harmless for a map write. For a large list, memoize the callback per row or move the registration into a memoized row component.

### Example 5: a commented video player with a ref handle

```jsx
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

/*
 * VideoPlayer owns the <video> element. The parent never touches the DOM
 * node directly; it calls the small API exposed through the forwarded ref.
 *
 * Public handle: { play, pause, restart, seek }
 */
const VideoPlayer = forwardRef(function VideoPlayer({ src, title }, ref) {
    // The DOM node. React fills this after the video element is committed.
    const videoRef = useRef(null);

    // The id of the pending animation frame. A ref because changing it
    // must not redraw the component.
    const frameRef = useRef(0);

    // State because both values are drawn on screen.
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [failed, setFailed] = useState("");

    // Expose four methods instead of the whole video element.
    useImperativeHandle(ref, () => ({
        play() {
            return videoRef.current?.play();
        },
        pause() {
            videoRef.current?.pause();
        },
        restart() {
            if (videoRef.current) videoRef.current.currentTime = 0;
        },
        seek(seconds) {
            const video = videoRef.current;
            if (!video) return;

            // Clamp so a caller cannot seek past the end or below zero.
            const max = Number.isFinite(video.duration) ? video.duration : 0;
            video.currentTime = Math.min(Math.max(seconds, 0), max);
        },
    }), []);

    // Subscriptions belong in an effect with a matching cleanup.
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        const onEnded = () => {
            setPlaying(false);
            setProgress(1);
        };
        const onError = () => setFailed("The video could not be loaded.");

        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);
        video.addEventListener("ended", onEnded);
        video.addEventListener("error", onError);

        return () => {
            // Stop playback, then remove every listener added above.
            video.pause();
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
            video.removeEventListener("ended", onEnded);
            video.removeEventListener("error", onError);
        };
    }, [src]);

    // While playing, sample the clock once per frame and draw a progress bar.
    // A real player would throttle this or use timeupdate; the frame id in a
    // ref is the part this example teaches.
    useEffect(() => {
        if (!playing) return;

        const tick = () => {
            const video = videoRef.current;
            if (!video) return;

            const ratio = video.duration ? video.currentTime / video.duration : 0;
            setProgress(ratio);
            frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
        };
    }, [playing]);

    return (
        <figure>
            <video
                ref={videoRef}
                src={src}
                muted
                playsInline
                preload="metadata"
                onClick={() => {
                    const video = videoRef.current;
                    if (!video) return;
                    if (video.paused) video.play().catch(() => {});
                    else video.pause();
                }}
            />

            <figcaption>{title}</figcaption>

            {failed && <p role="alert">{failed}</p>}

            <progress value={progress} max="1" />

            <div>
                <button onClick={() => videoRef.current?.play()}>Play</button>
                <button onClick={() => videoRef.current?.pause()}>Pause</button>
                <button
                    onClick={() => {
                        if (videoRef.current) videoRef.current.currentTime = 0;
                    }}
                >
                    Restart
                </button>
            </div>
        </figure>
    );
});

function Lesson() {
    // Data shape: null until the player mounts, then the public handle.
    const playerRef = useRef(null);

    return (
        <section>
            <VideoPlayer
                ref={playerRef}
                src="/media/intro.mp4"
                title="Welcome to the course"
            />

            <button onClick={() => playerRef.current?.seek(30)}>
                Skip to 0:30
            </button>
        </section>
    );
}

export default Lesson;
```

Read this component in four passes. First the refs: `videoRef` points at the element, `frameRef` holds the animation frame id, and `playerRef` in the parent holds the imperative handle. Second the handle: `useImperativeHandle` exposes four methods and nothing else, which keeps the parent away from the raw node. Third the effects: one attaches media listeners and one runs the progress loop, and both clean up frame handles and listeners. Fourth the render: the JSX only sets a ref and reads state, which is the rule that keeps the component predictable.

The `muted` attribute is there because browsers block autoplay with sound. The click handler plays or pauses the same element the parent can control. The failed state is set by the error listener, so a broken source produces a message instead of a blank box. If the component unmounts mid playback, the cleanup pauses the video and cancels the frame, so nothing keeps running after the screen is gone.

## Common mistakes

1. Reading `ref.current` during render and expecting a DOM node. It is `null` until the commit. Read it in an effect, a callback ref, or an event handler.

2. Using a ref for a value that must appear on screen. The write succeeds and the screen does not change. Use state for anything the user must see.

3. Initializing with an expensive call, `useRef(new Map(rows.map(toEntry)))`, and believing it runs once. The argument is evaluated every render. Use `useRef(null)` and fill it lazily.

4. Expecting `useRef(fn)` to call `fn`. It stores the function. Only `useState` treats a function argument as a lazy initializer.

5. Mutating React's DOM outside the parts React does not own. Changing text, removing children, or replacing `innerHTML` on a React managed node breaks reconciliation. Set focus, scroll, styles, or media state instead.

6. Passing a ref to a function component and expecting the DOM node. On React 18 the child must use `forwardRef`; on React 19 it must accept and attach `ref`. Otherwise the ref stays `null`.

7. Forgetting the cleanup for an interval or a listener. The visible symptom is a doubled counter in StrictMode, a warning about setting state on an unmounted component, or work that continues after navigation.

8. Clearing a timer but leaving the old id in `ref.current`. A later clear can hit an id that the browser reused, or `start` refuses to run because it still sees an id. Set the ref to `null` inside the cleanup.

9. Using an inline callback ref, `ref={(node) => setWidth(node.offsetWidth)}`, and getting a render loop. The function is new on every render, so React detaches and reattaches, and the state update schedules another render. Wrap it in `useCallback` or compare the measured value before setting state.

10. Returning a value from a callback ref on React 19, `ref={(node) => (map.current[id] = node)}`. The assignment expression returns the node, and React treats it as a cleanup function. Use a block body.

11. Reading `ref.current` in a `useEffect` whose dependency array contains only the ref object. The object never changes, so the effect never reruns when the node appears or disappears. Depend on the state that controls the node, or use a callback ref.

12. Copying a ref into a local variable and using it after an `await`. The node may be gone by then. Read the ref again and check for `null`.

13. Keeping derived state in a ref to "avoid renders". If the value is derived from props or state and is shown, compute it during render or keep it in state. A ref that silently disagrees with the last render is a bug waiting for a slow network.

14. Calling `useRef` inside a condition or a loop. Hook order breaks and React throws. Call it at the top level, even if the value is used only in one branch.

15. Putting a side effect in the ref initializer. StrictMode runs the render twice, so the effect runs twice. Use an effect with a cleanup for anything outside pure computation.

16. Treating `useImperativeHandle` as a way to pass all state down. Expose two or three actions, not the internals. If the parent needs to read many values, pass them as props.

## Exam checklist

1. Can you write the shape of the return value from memory, `{ current: value }`, and say what `useRef(null)` returns?

2. Can you explain why changing `ref.current` does not re-render, in terms of React not tracking plain object properties?

3. Can you choose between `useState`, `useRef`, and a local variable for a counter, a timer id, and a DOM node, and justify each choice?

4. Can you focus an input on mount with a ref and an effect, including the `null` guard?

5. Can you store a `setInterval` id in a ref, clear it in a cleanup, and reset the ref to `null`?

6. Can you write a `usePrevious` hook with a ref and an effect, and explain why the effect runs after the value is used?

7. Can you scroll to the bottom of a list after a new item is added, using a marker ref and an effect dependency?

8. Can you call `play()` and `pause()` on a video ref, and explain why `play()` needs a `catch`?

9. Can you write a callback ref that measures an element, and explain why its identity must be stable?

10. Can you expose `focus` and `clear` through `useImperativeHandle` and consume them from a parent ref?

11. Can you convert a component to `forwardRef` and say what changes in React 19?

12. Can you describe what StrictMode does to refs, effects, and callback refs in development, and why removing StrictMode is not a fix?

13. Can you name three common mistakes around refs and give the correction for each?

14. Can you point out where a ref is the wrong tool because the value is rendered, and rewrite that case with state?

