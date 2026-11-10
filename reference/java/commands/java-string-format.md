# String.format

Java command · Strings

Builds a formatted string. %s string, %d integer, %.2f two decimals, %n newline.

## Syntax

```java
String.format("%s: %d", name, count)
```

## Example

```java
String name = "Anna";
int nights = 3;
double price = 89.9;

String text = String.format("%s: %d nights, %.2f EUR", name, nights, price);
System.out.println(text);
```
