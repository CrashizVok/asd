# Enum

Java topic · Exam Wiki

```java
enum Status {
    PENDING, PAID, CANCELLED
}

Status status = Status.PAID;
if (status == Status.PAID) {
    System.out.println("Paid");
}
System.out.println(status.name());   // PAID
System.out.println(status.ordinal()); // 1
```

An enum is a fixed set of constants. Compare with `==`. Use `name()` for the label, `values()` to loop, and `valueOf("PAID")` to parse.
