# switch

Java command · Control flow

Chooses a branch by value. Do not forget break in the classic form. The arrow form has no fall-through.

## Syntax

```java
switch (value) { case 1: ... break; default: ... }
```

## Example

```java
int stars = 4;

switch (stars) {
    case 5:
        System.out.println("Luxury");
        break;
    case 4:
        System.out.println("Great");
        break;
    default:
        System.out.println("Standard");
}
```
