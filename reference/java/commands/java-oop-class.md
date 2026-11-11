# class

Java command · Classes

Declares a type. The class is the blueprint, each object made from it is an instance with its own field values.

## Syntax

```java
class Name { fields; methods; }
```

## Example

```java
// Data shape: Hotel { name: String, stars: int }
class Hotel {
    private String name;
    private int stars;

    Hotel(String name, int stars) {
        this.name = name;
        this.stars = stars;
    }

    String label() {
        return name + " (" + stars + " stars)";
    }
}

Hotel h = new Hotel("Danube View", 4);
System.out.println(h.label());   // Danube View (4 stars)
```

## Details

One file can hold several classes, but only one of them may be `public`, and its name must match the file name. A class with no access modifier is visible only inside its package. Fields belong to each object; a `static` field belongs to the class. Keep the fields `private` and expose behaviour through methods so the object decides what is legal.
