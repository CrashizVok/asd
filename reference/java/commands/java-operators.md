# operators

Java command · Basics

Arithmetic, comparison, and logic. Integer division drops the remainder. Use == for primitives and equals for strings and objects.

## Syntax

```java
+ - * / % == != > < && || !
```

## Example

```java
int a = 7;
int b = 2;

System.out.println(a / b); // 3
System.out.println(a % b); // 1
System.out.println(a > b && b > 0); // true

String x = "hi";
System.out.println(x.equals("hi")); // true
```
