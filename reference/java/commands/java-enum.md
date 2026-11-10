# enum

Java command · OOP

A fixed set of constants. Enums can have fields, constructors, and methods.

## Syntax

```java
enum Status { NEW, PAID, CANCELLED }
```

## Example

```java
enum Status {
    NEW, PAID, CANCELLED
}

Status status = Status.PAID;
if (status == Status.PAID) {
    System.out.println("Paid");
}
```
