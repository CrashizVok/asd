# Fail fast validation

Java command · Exceptions

Rejects a bad argument at the top of the method, with the field name and the received value in the message, before any work is done.

## Syntax

```java
if (bad) throw new IllegalArgumentException(message)
```

## Example

```java
// File: ValidateStars.java
// Data shape: validateStars(int) -> void, throws IllegalArgumentException on bad input
public class ValidateStars {

    static final int MIN = 1;
    static final int MAX = 5;

    static void validateStars(int stars) {
        // Fail fast, and put the field name and the received value in the message.
        if (stars < MIN || stars > MAX) {
            throw new IllegalArgumentException(
                    "stars must be " + MIN + ".." + MAX + ", got " + stars);
        }
    }

    // The caller validates once, then works with a value it can trust.
    static String label(int stars) {
        validateStars(stars);
        return switch (stars) {
            case 1, 2 -> "budget";
            case 3 -> "standard";
            default -> "premium";
        };
    }

    public static void main(String[] args) {
        System.out.println(label(4));

        try {
            System.out.println(label(9));
        } catch (IllegalArgumentException e) {
            // No throws clause was needed: validation failures are unchecked.
            System.out.println(e.getMessage());
        }
    }
}
```

## Details

Validate at the point where the value enters, then let the rest of the method work with a value it can trust. A check buried three calls deep costs the reader a stack trace and costs the caller a partial write.

The message should name the field, the accepted range, and the value received. `stars must be 1..5, got 9` answers the question without opening the source.

For user supplied text, validation usually means collecting every problem and throwing one exception that carries the list, not throwing on the first field. `IllegalArgumentException` is for a caller that passed the wrong argument, which is a different situation from a user who typed the wrong value.
