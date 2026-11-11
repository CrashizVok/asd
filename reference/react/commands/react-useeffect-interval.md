# interval in an effect

React command · Effects

Starts a repeating timer after mount and clears it on unmount. Use the functional state update inside the tick to avoid a stale value.

## Syntax

```jsx
useEffect(() => { const id = setInterval(fn, ms); return () => clearInterval(id); }, [])
```

## Example

```jsx
// Data shape: seconds: number
export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      // Functional update: the interval never reads a frozen seconds value.
      setSeconds((value) => value + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  return (
    <>
      <p>{seconds} s</p>
      <button onClick={() => setRunning(!running)}>
        {running ? "Stop" : "Start"}
      </button>
    </>
  );
}
```

## Details

`setSeconds(seconds + 1)` inside the interval reads `seconds` from the render that created the timer, which is `0`. The display counts 0, 1, 1, 1 and looks frozen. The functional form receives the current value and has no stale read.

The conditional `return` before the setup is legal: the hook is called on every render, only the body changes. What must never be conditional is the `useEffect` call itself.

With `[running]` in the array, starting and stopping creates and clears exactly one interval. With `[]`, pressing Start twice leaves two intervals running and the counter speeds up.
