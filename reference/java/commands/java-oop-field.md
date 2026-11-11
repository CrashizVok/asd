# instance field

Java command · Classes

A variable stored in every object. A final field is assigned once and cannot change afterwards.

## Syntax

```java
private Type name;
```

## Example

```java
class Room {
    private final int number;      // set once in the constructor
    private int beds = 2;          // default at declaration
    private double nightly;

    Room(int number, double nightly) {
        this.number = number;      // final field must be assigned here
        this.nightly = nightly;
    }

    int getNumber() { return number; }
    int getBeds() { return beds; }
    void setBeds(int beds) { this.beds = beds; }
}
```

## Details

A field declared `final` can be assigned where it is declared or in every constructor, nowhere else. That makes it a safe default for identity values such as an id or a name. Without `final`, every public setter is a door into the state, so add one only when the value really has to change.
