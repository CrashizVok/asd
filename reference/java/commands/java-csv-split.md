# CSV split

Java command · Files

Splits a CSV line. The -1 limit keeps empty trailing fields. Check the header before parsing data rows.

## Syntax

```java
line.split(",", -1)
```

## Example

```java
String line = "anna@example.com,Anna,Kovacs,,1998-05-12";
String[] parts = line.split(",", -1);

String email = parts[0];
String first = parts[1];
String birthday = parts[4];
System.out.println(email + " " + first + " " + birthday);
```
