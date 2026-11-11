# getter

Java command · Encapsulation

Returns a field or a value derived from it. Booleans use the isField() form. Records use the bare component name.

## Syntax

```java
Type getField() { return field; }
```

## Example

```java
class Hotel {
    private final String name;
    private final boolean open;

    Hotel(String name, boolean open) {
        this.name = name;
        this.open = open;
    }

    String getName() { return name; }

    boolean isOpen() { return open; }

    // A derived getter has no field behind it.
    String getLabel() { return name + (open ? " (open)" : " (closed)"); }
}

Hotel h = new Hotel("Hilltop", true);
System.out.println(h.isOpen());    // true
System.out.println(h.getLabel());  // Hilltop (open)
```

## Details

Do not write a getter for every field by reflex. A getter on a mutable collection hands out the internal list, which lets a caller add items without validation; return `List.copyOf(...)` in that case. A field that never changes after construction should be `final` with a getter and no setter, so the compiler enforces the rule.
