# setter

Java command · Encapsulation

The single door into a mutable field. It validates before assigning, so no caller can store an invalid value.

## Syntax

```java
void setField(Type value) { this.field = value; }
```

## Example

```java
class Room {
    private int beds;
    private double nightly;

    Room(int beds, double nightly) {
        setBeds(beds);        // reuse the rules during construction
        setNightly(nightly);
    }

    int getBeds() { return beds; }

    void setBeds(int beds) {
        if (beds < 1 || beds > 6) {
            throw new IllegalArgumentException("beds must be 1..6");
        }
        this.beds = beds;
    }

    double getNightly() { return nightly; }

    void setNightly(double nightly) {
        if (nightly < 0) {
            throw new IllegalArgumentException("nightly cannot be negative");
        }
        this.nightly = nightly;
    }
}
```

## Details

The constructor should call the setters, not assign the fields directly, otherwise the object is validated on one path and not on the other. A setter that only assigns with no check is usually a sign the field should have been `final`. Validation that depends on several fields at once belongs in a method such as `validate()`, not in one setter.
