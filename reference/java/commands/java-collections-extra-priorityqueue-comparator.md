# PriorityQueue order

Java command · Queues

Hands out the smallest element by comparator instead of the oldest. It implements Queue but is not first in, first out.

## Syntax

```java
new PriorityQueue<>(Comparator.comparingInt(Type::key))
```

## Example

```java
Queue<Booking> shortestFirst = new PriorityQueue<>(
        Comparator.comparingInt(Booking::nights));
shortestFirst.add(new Booking("Danube View", 4));
shortestFirst.add(new Booking("City Inn", 1));
shortestFirst.add(new Booking("Alpen Hof", 2));

// poll returns the smallest key each time, not the insertion order.
while (!shortestFirst.isEmpty()) {
    System.out.println(shortestFirst.poll().nights());   // 1, 2, 4
}
```

## Details

The heap only guarantees the head. Iterating or printing the queue shows the internal array order, not sorted order, so drain it with `poll` when the order matters.

`add` and `offer` are both logarithmic. Equal keys are ordered arbitrarily, so add a tie breaker when the output must be reproducible.
