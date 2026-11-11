# new

Java command · Classes

Allocates one object on the heap, fills fields with default values, runs a constructor, and returns a reference.

## Syntax

```java
Type ref = new Type(arguments);
```

## Example

```java
// Two variables can point at the same object.
Hotel a = new Hotel("Hilltop", 3);
Hotel b = a;

a.setStars(5);
System.out.println(b.getStars());   // 5, same object

// A fresh object starts from defaults before the constructor runs:
// null for objects, 0 for numbers, false for boolean.
Hotel empty = null;                 // no object yet, only a null reference
System.out.println(empty == null);  // true
```

## Details

`new` returns a reference, not the object itself. Java passes that reference by value into methods, so a method can change the object's fields but cannot make your variable point at something else. Comparing two references with `==` asks whether they point at the same object, not whether their contents match.
