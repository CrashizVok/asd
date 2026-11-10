# if, else if, else

Java command · Control flow

Runs a block when a condition is true. Conditions must be boolean, not numbers.

## Syntax

```java
if (condition) { ... } else { ... }
```

## Example

```java
int stars = 4;

if (stars >= 5) {
    System.out.println("Luxury");
} else if (stars >= 3) {
    System.out.println("Comfortable");
} else {
    System.out.println("Basic");
}
```
