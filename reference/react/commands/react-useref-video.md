# video control

React command · DOM

Controls a media element through its DOM methods. play returns a promise, so handle a rejected autoplay attempt.

## Syntax

```jsx
videoRef.current?.play()
```

## Example

```jsx
import { useRef } from "react";

function Clip({ src }) {
  const videoRef = useRef(null);

  async function play() {
    try {
      await videoRef.current?.play();
    } catch (error) {
      // Autoplay policy or a source that is not ready yet.
      console.log("play failed", error.name);
    }
  }

  return (
    <>
      <video ref={videoRef} src={src} muted playsInline preload="metadata" />
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

## Details

Read `currentTime` and `duration` from the element in a `timeupdate` handler when you need a progress bar. Do not drive playback from React state on every frame.

`muted` is what makes autoplay possible in most browsers. `requestFullscreen()` must be called from a user gesture.
