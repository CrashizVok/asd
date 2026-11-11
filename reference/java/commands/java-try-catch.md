# try / catch

Java command · Exceptions

Runs a block and handles a matching exception instead of letting it leave the method.

## Syntax

```java
try { ... } catch (Type e) { ... }
```

## Example

```java
// Data shape: catch parameter e is the thrown object, already filled with a stack trace.
String text = "4";

try {
    int stars = Integer.parseInt(text);
    System.out.println("stars: " + stars);
} catch (NumberFormatException e) {
    System.out.println("not a number: " + text);
    System.out.println("detail: " + e.getMessage());
}

// A try block can have several handlers. First match wins.
try {
    int[] values = new int[2];
    values[5] = 1;
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("index out of range");
} catch (RuntimeException e) {
    System.out.println("other runtime problem");
}
```

## Details

The catch block runs only when the exception type matches or is a supertype. After it finishes, execution continues after the whole try statement, not inside the try block where the failure happened.

Keep the try block short. A wide block that catches Exception hides which line failed and makes the handler guess.
