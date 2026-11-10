# for-each loop

Java command · Control flow

Visits every element of an array or Iterable. It does not give the index.

## Syntax

```java
for (Type item : collection) { ... }
```

## Example

```java
String[] guests = {"Anna", "Ben", "Cara"};

for (String guest : guests) {
    System.out.println(guest);
}
```
