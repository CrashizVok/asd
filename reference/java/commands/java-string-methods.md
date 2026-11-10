# String methods

Java command · Strings

Common methods: length, charAt, substring, indexOf, contains, startsWith, endsWith, replace, split, trim.

## Syntax

```java
text.length()
text.substring(a, b)
text.indexOf("x")
```

## Example

```java
String email = "anna@example.com";

System.out.println(email.contains("@"));
System.out.println(email.indexOf("@"));
System.out.println(email.substring(0, 4));
System.out.println(email.replace(".com", ".hu"));
System.out.println(email.split("@")[0]);
```
