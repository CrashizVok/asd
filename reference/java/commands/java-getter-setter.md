# getters and setters

Java command · OOP

Control access to private fields. A getter reads; a setter can validate before writing.

## Syntax

```java
public String getName() { return name; }
```

## Example

```java
class Guest {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Name required");
        this.name = name;
    }
}
```
