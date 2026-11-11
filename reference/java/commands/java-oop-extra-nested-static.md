# static nested class

Java command · Nested classes

A class declared inside another class with no link to an outer instance. It is used as Outer.Nested and can be created on its own.

## Syntax

```java
class Outer { static class Nested { } }
```

## Example

```java
class Hotel {
    private final String name;
    private int reviews;

    Hotel(String name) { this.name = name; }

    void addReview() { reviews++; }

    static class Stats {                  // no outer object required
        private int hotels;
        private int reviews;

        void record(Hotel h) {
            hotels++;
            reviews += h.reviews;         // the outer object arrives as a parameter
        }

        @Override
        public String toString() {
            return hotels + " hotels, " + reviews + " reviews";
        }
    }
}

Hotel.Stats stats = new Hotel.Stats();   // no Hotel before the dot
Hotel a = new Hotel("Danube View");
a.addReview();
stats.record(a);
System.out.println(stats);               // 1 hotels, 1 reviews
```

## Details

A static nested class is a normal class that happens to live under another name. It can read the outer class's `private` members when it is given an instance, but it gets no hidden reference of its own. Use it for helpers that belong to the class by meaning: a `Builder`, a `Stats`, a constant table, a small key type.
