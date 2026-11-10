# ResultSet

Java command · JDBC

Holds query rows. next() moves to the next row and returns false when there are no more.

## Syntax

```java
while (rs.next()) { rs.getString("column"); }
```

## Example

```java
while (rs.next()) {
    int id = rs.getInt("id");
    String name = rs.getString("name");
    int stars = rs.getInt("stars");
    System.out.println(id + " " + name + " " + stars);
}
```
