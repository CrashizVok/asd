# class and object

Java command · OOP

A class defines fields and methods. new creates an object. The constructor initializes it.

## Syntax

```java
class Hotel { ... }
new Hotel(...)
```

## Example

```java
class Hotel {
    String name;
    int stars;

    Hotel(String name, int stars) {
        this.name = name;
        this.stars = stars;
    }

    void print() {
        System.out.println(name + ", " + stars + " stars");
    }
}

Hotel hotel = new Hotel("Danube View", 4);
hotel.print();
```
