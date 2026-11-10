# casting

Java command · Basics

Converts between types. Narrowing a double to int cuts the decimals. Parsing a string uses Integer.parseInt.

## Syntax

```java
(int) value
```

## Example

```java
double price = 12.99;
int whole = (int) price; // 12

String text = "42";
int number = Integer.parseInt(text);
double value = Double.parseDouble("3.5");
```
