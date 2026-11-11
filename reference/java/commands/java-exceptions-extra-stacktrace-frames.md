# getStackTrace()

Java command · Diagnostics

Returns the frames captured for one throwable. Frame 0 is the throw site, and the earlier failures live in the cause chain, not in this array.

## Syntax

```java
e.getStackTrace()
```

## Example

```java
// File: StackFrames.java
// Data shape: e.getStackTrace() -> StackTraceElement[] {className, methodName, fileName, lineNumber}
public class StackFrames {

    static void inner() {
        throw new IllegalStateException("parser gave up");
    }

    static void middle() {
        inner();
    }

    static void outer() {
        middle();
    }

    public static void main(String[] args) {
        try {
            outer();
        } catch (IllegalStateException e) {
            StackTraceElement[] frames = e.getStackTrace();

            System.out.println("depth: " + frames.length);
            // Frame 0 is the throw site, so it names the line that created the object.
            System.out.println("created at: " + frames[0]);
            System.out.println("its caller: " + frames[1]);

            for (int i = 0; i < Math.min(3, frames.length); i++) {
                StackTraceElement frame = frames[i];
                System.out.println("  #" + i + " " + frame.getMethodName()
                        + " line " + frame.getLineNumber() + " in " + frame.getFileName());
            }

            // Trimming for a log: keep only frames from the application's own classes.
            for (StackTraceElement frame : frames) {
                if (frame.getClassName().startsWith("StackFrames")) {
                    System.out.println("app: " + frame);
                }
            }
        }
    }
}
```

## Details

Each `StackTraceElement` exposes `getClassName`, `getMethodName`, `getFileName`, `getLineNumber`, and `isNativeMethod`. In a log, the first frames name the throw site and the rest show the call path.

The array belongs to the throwable where it was created. When a method wraps a failure, the new exception has its own frames and the original keeps its own, which is why a cause chain prints as several blocks.

Filling the trace costs time. For a control flow exception created in a tight loop, that cost shows up in a profiler; the fix is to stop using an exception there, not to override `fillInStackTrace`.
