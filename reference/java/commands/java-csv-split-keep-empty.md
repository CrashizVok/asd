# split(",", -1)

Java command · CSV

Splits a CSV line and keeps trailing empty fields. Without the -1 limit, empty fields at the end disappear and indexes shift.

## Syntax

```java
line.split(",", -1)
```

## Example

```java
String line = "101,Budapest,2,";

String[] bad = line.split(",");      // length 3, the last empty field is gone
String[] good = line.split(",", -1); // length 4, good[3] is ""

System.out.println(bad.length);
System.out.println(good.length);
System.out.println("last=[" + good[3] + "]");

// An empty field in the middle is kept either way.
String middle = "anna@example.com,Kovacs,Anna,,1998-05-12";
System.out.println(middle.split(",").length); // 5
```

## Details

The first argument is a regex. Escape pipes as `"\\|"` and use `"\\t"` for tabs. The limit `-1` means keep all fields, including empty trailing ones; a positive limit stops after that many fields.

Only trailing empties vanish without the limit. An empty field between two values stays.
