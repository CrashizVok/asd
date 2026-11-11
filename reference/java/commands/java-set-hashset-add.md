# HashSet add

Java command · Sets

Stores unique elements. Returns false when the element was already present, which makes duplicate detection a one liner.

## Syntax

```java
set.add(value)
```

## Example

```java
Set<String> guests = new HashSet<>();
boolean first = guests.add("anna@example.com");    // true
boolean again = guests.add("anna@example.com");    // false

System.out.println(guests.size());   // 1
System.out.println(guests.contains("anna@example.com"));   // true
```

## Details

The set uses `equals` and `hashCode`. A mutable field that feeds `hashCode` must not change while the object sits in the set, or lookups stop finding it.
