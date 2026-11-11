# inner class

Java command · Nested classes

A non static nested class. Every instance is bound to one outer instance and can read its fields without a getter.

## Syntax

```java
class Outer { class Inner { } }
```

## Example

```java
class Hotel {
    private final String name;
    private int reviews;

    Hotel(String name) { this.name = name; }

    class Review {                        // inner: this Review belongs to this Hotel
        private final String text;

        Review(String text) { this.text = text; }

        String describe() {
            return name + " (" + reviews + " reviews): " + text;   // outer fields, no getter
        }
    }

    Review review(String text) {
        reviews++;
        return new Review(text);
    }
}

Hotel a = new Hotel("Danube View");
Hotel.Review r = a.review("quiet rooms");
System.out.println(r.describe());        // Danube View (1 reviews): quiet rooms

Hotel b = new Hotel("Hilltop");
System.out.println(b.review("good food").describe());

// The long form of the same creation:
Hotel.Review direct = a.new Review("late check in");
```

## Details

Constructing an inner class needs an outer object: `a.review(...)` or the explicit `a.new Review(...)`. The inner object holds a hidden pointer to that `Hotel`, so it can read `name` and `reviews` directly, and it keeps the outer object alive for as long as it exists. If that link is not part of the design, make the nested class `static`.
