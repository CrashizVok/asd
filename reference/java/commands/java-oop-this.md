# this

Java command · Constructors

Refers to the current object. Needed when a parameter has the same name as a field, and as this(...) to chain constructors.

## Syntax

```java
this.field = value;   this(args);
```

## Example

```java
class Hotel {
    private String name;
    private int stars;

    Hotel(String name, int stars) {
        this.name = name;     // field on the left, parameter on the right
        this.stars = stars;
    }

    Hotel(String name) {
        this(name, 3);        // calls the other constructor, must be line one
    }

    Hotel copy() {
        return new Hotel(this.name, this.stars);
    }
}
```

## Details

`this(...)` must be the first statement of a constructor, so a constructor either chains to another one or calls `super(...)`, never both. After a chain, the compiler still inserts one `super()` call at the top of the chain. Forgetting `this` in an assignment such as `name = name` assigns the parameter to itself and leaves the field `null`.
