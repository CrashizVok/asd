# List, Map, Set interfaces

Java command · Collections

Declare the interface and create a concrete implementation. It makes the code easier to change later.

## Syntax

```java
List<String> list = new ArrayList<>();
```

## Example

```java
import java.util.*;

List<String> list = new ArrayList<>();
Map<String, Integer> map = new HashMap<>();
Set<String> set = new HashSet<>();

list.add("Anna");
map.put("Anna", 2);
set.add("Anna");
```
