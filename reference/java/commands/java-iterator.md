# Iterator

Java command · Collections

Walks a collection. Use it.remove() to remove during iteration; removing from the list directly causes ConcurrentModificationException.

## Syntax

```java
Iterator<String> it = list.iterator();
```

## Example

```java
import java.util.*;

List<String> list = new ArrayList<>(List.of("Anna", "Ben"));
Iterator<String> it = list.iterator();

while (it.hasNext()) {
    String name = it.next();
    if (name.equals("Ben")) it.remove();
}
```
