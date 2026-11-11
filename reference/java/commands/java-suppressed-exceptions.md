# Suppressed exceptions

Java command · Exceptions

When the body throws and close also throws, the body failure stays primary and the close failure is attached as suppressed.

## Syntax

```java
for (Throwable t : e.getSuppressed()) { ... }
```

## Example

```java
import java.io.IOException;

class SuppressedDemo {

    static class FailingClose implements AutoCloseable {
        private final String name;

        FailingClose(String name) {
            this.name = name;
        }

        @Override
        public void close() throws IOException {
            throw new IOException(name + " close failed");
        }
    }

    public static void main(String[] args) {
        try (FailingClose first = new FailingClose("first");
             FailingClose second = new FailingClose("second")) {
            throw new IllegalStateException("body failed");
        } catch (Exception e) {
            System.out.println("primary: " + e); // IllegalStateException
            for (Throwable suppressed : e.getSuppressed()) {
                System.out.println("suppressed: " + suppressed); // second, then first
            }
        }
    }
}
```

## Details

A hand-written finally that calls close would replace the body exception with the close exception, and the real cause would be lost. Try-with-resources avoids that by suppressing instead of replacing.

Call addSuppressed only when you are already handling the primary exception. Adding the primary to itself throws IllegalArgumentException.
