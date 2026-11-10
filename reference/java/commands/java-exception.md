# try, catch, finally

Java command · Exceptions

Handles exceptions. Catch the most specific type first. finally always runs.

## Syntax

```java
try { ... } catch (Exception e) { ... } finally { ... }
```

## Example

```java
try {
    int number = Integer.parseInt("abc");
    System.out.println(number);
} catch (NumberFormatException e) {
    System.out.println("Not a number: " + e.getMessage());
} finally {
    System.out.println("done");
}
```
