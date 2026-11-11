# Close order in try-with-resources

Java command · Resources

Resources close in reverse declaration order, on every exit path, and close failures become suppressed when the body also throws.

## Syntax

```java
try (A a = open(); B b = open()) { }
```

## Example

```java
// File: ResourcesOrder.java
// Data shape: try (a; b; c) closes c, then b, then a, always
public class ResourcesOrder {

    static class Handle implements AutoCloseable {
        private final String name;

        Handle(String name) {
            this.name = name;
            System.out.println("open " + name);
        }

        void use() {
            System.out.println("use " + name);
        }

        @Override
        public void close() {
            // close() runs even when the body throws, so this line always prints.
            System.out.println("close " + name);
        }
    }

    public static void main(String[] args) {
        // Declare in acquisition order: connection, statement, result set.
        try (Handle connection = new Handle("connection");
             Handle statement = new Handle("statement");
             Handle resultSet = new Handle("result set")) {

            connection.use();
            statement.use();
            resultSet.use();
            // A throw here would still close resultSet, statement, connection.
        }

        // Java 9 form: an existing, effectively final variable can be listed alone.
        Handle late = new Handle("late handle");
        try (late) {
            late.use();
        }
    }
}
```

## Details

The compiler rewrites the header into nested blocks, so the last declared resource closes first. Declare in acquisition order, connection then statement then result set, and the reverse close order is the one those objects need.

If the body throws and `close()` also throws, the body failure stays primary and the close failure lands in `getSuppressed()`. A hand written `finally` cannot do that without explicit bookkeeping, which is the main reason the language form wins.

Java 9 lets an already declared, effectively final variable stand alone in the header: `try (reader) { ... }`. The variable is closed at the end of that block, so do not reuse it afterwards.
