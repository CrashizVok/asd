# String

Java command · Strings

Strings are immutable objects. Use equals to compare content, not ==.

## Syntax

```java
String name = "Anna";
```

## Example

```java
String first = "Anna";
String last = "Kovacs";
String full = first + " " + last;

System.out.println(full.length());
System.out.println(full.toUpperCase());
System.out.println(full.equals("Anna Kovacs"));
```
