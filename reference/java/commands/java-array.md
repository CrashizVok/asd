# array

Java command · Arrays

A fixed-size sequence. length is a field, not a method. Indexes start at 0.

## Syntax

```java
int[] numbers = {1, 2, 3};
```

## Example

```java
int[] numbers = {4, 8, 15};
String[] names = new String[3];
names[0] = "Anna";

System.out.println(numbers.length);
System.out.println(numbers[0]);
for (int n : numbers) System.out.println(n);
```
