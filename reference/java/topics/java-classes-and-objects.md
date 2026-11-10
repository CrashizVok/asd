# Classes and objects

Java topic · Exam Wiki

```java
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
System.out.println(h.label());
```

A class is the blueprint, an object is one instance. `private` hides the field, the constructor sets it, and a method exposes behaviour. Use `this.field` when a parameter has the same name.
