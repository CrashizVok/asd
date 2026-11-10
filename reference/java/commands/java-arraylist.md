# ArrayList

Java command · Collections

A resizable list. add, get, set, remove, size, contains, and clear are the common methods.

## Syntax

```java
new ArrayList<String>()
```

## Example

```java
import java.util.ArrayList;

ArrayList<String> guests = new ArrayList<>();
guests.add("Anna");
guests.add("Ben");

System.out.println(guests.get(0));
System.out.println(guests.size());
guests.remove("Ben");
for (String guest : guests) System.out.println(guest);
```
