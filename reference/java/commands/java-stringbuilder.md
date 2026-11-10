# StringBuilder

Java command · Strings

Builds a string efficiently in a loop. String concatenation in a loop creates many objects.

## Syntax

```java
new StringBuilder().append("a").append("b")
```

## Example

```java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 3; i++) {
    sb.append(i).append(" ");
}
System.out.println(sb.toString().trim()); // 1 2 3
```
