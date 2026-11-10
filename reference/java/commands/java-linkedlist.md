# LinkedList

Java command · Collections

A list with fast add/remove at the ends. It can also act as a queue or deque.

## Syntax

```java
new LinkedList<String>()
```

## Example

```java
import java.util.LinkedList;

LinkedList<String> queue = new LinkedList<>();
queue.add("Anna");
queue.add("Ben");

System.out.println(queue.removeFirst()); // Anna
queue.addLast("Cara");
```
