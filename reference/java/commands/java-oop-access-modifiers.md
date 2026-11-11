# access modifiers

Java command · Encapsulation

Control who can see a class, field, constructor, or method. Start private and widen only when a caller needs it.

## Syntax

```java
private | package-private | protected | public
```

## Example

```java
class Hotel {
    private int stars = 3;          // this class only
    int floor;                      // package-private, same package
    protected String ownerEmail;    // same package plus subclasses
    public String name;             // everyone

    private void check() { }        // helper, not part of the API

    public int getStars() { return stars; }
}
```

## Details

A top level class can only be `public` or package-private. `protected` means the same package plus subclasses, which is wider than most beginners expect. Narrowing visibility in an override is a compile error, so a `public` parent method must stay `public` in every subclass.
