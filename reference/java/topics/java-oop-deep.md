# Java OOP in depth

Java topic · Exam Wiki

## Simplest form

```java
// Data shape: Hotel { name: String, stars: int }
class Hotel {
    String name;
    int stars;
}

Hotel h = new Hotel();      // one object on the heap
h.name = "Danube View";     // fields hold the state
h.stars = 4;
```

This is the smallest class that compiles and the smallest object you can make. The fields are package visible, so any other class in the same package can change them without asking. That is fine for a two line demo and wrong for anything a user can reach. The rest of this page adds the parts that make the shape safe: a constructor, private fields, accessors, and methods that own the rules.

## What it does

A class is a type you define. It holds fields (the data every object of that type carries) and methods (the behaviour that reads or changes that data). The class itself is a template sitting in the class loader. An object is one concrete copy of that template in heap memory, reached through a reference variable.

`new Hotel()` does three things in order. It reserves memory for a fresh object, it fills every field with the default for its type (`null`, `0`, `0.0`, `false`), and it runs a constructor. The reference you get back points at that one object. Two variables can point at the same object, and changing a field through one is visible through the other, because there is still only one object.

```java
Hotel a = new Hotel();
Hotel b = a;               // same object, not a copy
a.stars = 5;
System.out.println(b.stars);   // 5
```

Java passes the reference by value. A method receives its own copy of the reference, which is why it can change the object's fields but cannot make your variable point somewhere else.

## Every part

### Fields

A field is a variable that lives inside each object. Declare it with an access modifier, a type, and a name. Instance fields belong to one object. A field marked `final` must be assigned exactly once, either where it is declared or in every constructor.

```java
class Hotel {
    private final String name;     // set in the constructor, never after
    private int stars;             // can change
    private double nightly = 90.0; // default written at the declaration
}
```

Give every field the narrowest visibility that still works. `private` is the default choice. A field is not part of the class API unless you decide it is.

### Methods

A method is a named block with a return type, a parameter list, and a body. It may read fields directly, because it runs with a `this` reference to the object it was called on.

```java
class Hotel {
    private int stars = 3;

    boolean isLuxury() {          // no parameters, returns boolean
        return stars >= 4;
    }

    double totalFor(int nights) { // one parameter
        return 90.0 * nights;
    }
}
```

The method signature is the name plus the parameter types. The return type is not part of it, which is why two methods cannot differ only by return type.

### Constructors

A constructor has the class name and no return type. Its job is to leave the object in a valid state. If you write no constructor, the compiler adds a no argument one that does nothing. The moment you write any constructor, that free one disappears.

```java
class Hotel {
    private final String name;
    private int stars;

    Hotel(String name, int stars) {
        this.name = name;
        this.stars = stars;
    }
}
```

Validate in the constructor, not later. A constructor that accepts `null` or `-4` pushes the failure to some distant line where nobody remembers which object caused it. Throwing from the constructor is allowed and correct.

### this

`this` is a reference to the object the method or constructor is running on. You need it in three places:

```java
class Hotel {
    private String name;
    private int stars;

    Hotel(String name, int stars) {
        this.name = name;   // parameter on the right, field on the left
        this.stars = stars;
    }

    Hotel(String name) {
        this(name, 3);      // calls another constructor, must be the first line
    }

    Hotel copy() {
        return new Hotel(this.name, this.stars);  // pass the current object's data
    }
}
```

`this(...)` chains constructors and removes duplicated validation. It must be the first statement, so a constructor either chains or calls `super()`, never both.

### Encapsulation

Encapsulation means the object guards its own state. Callers ask through methods; the class decides what is legal. The point is a value that is always valid, instead of a field that is sometimes `-1` because a caller guessed.

Take a field that must stay between 1 and 5:

```java
class Hotel {
    private int stars = 3;

    int getStars() {
        return stars;
    }

    void setStars(int stars) {
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("stars must be 1..5, got " + stars);
        }
        this.stars = stars;
    }
}
```

The rule lives in one place. Every path that changes `stars` goes through `setStars`, so no future edit can store `7` without passing the check.

### Getters and setters

A getter returns a field or a value derived from it. A setter validates and assigns. The convention is `getX()` and `setX()` for fields, `isX()` for booleans. Records use `x()` instead, which is covered below.

```java
class Hotel {
    private String name;
    private boolean open;

    String getName() { return name; }

    boolean isOpen() { return open; }

    void setOpen(boolean open) { this.open = open; }
}
```

Do not generate a getter and setter for every field by reflex. A field that never changes after construction should be `final` and get only a getter. That turns a possible bug into a compile error.

### static

A static member belongs to the class, not to an object. There is one copy, shared by every instance, and you reach it through the class name.

```java
class Hotel {
    private static int created;              // one counter for the whole class
    private static final int MAX_STARS = 5;  // constant, shared

    private final String name;

    Hotel(String name) {
        this.name = name;
        created++;
    }

    static int createdCount() {              // no this inside
        return created;
    }

    static Hotel withStars(String name, int stars) {   // static factory
        if (stars > MAX_STARS) {
            throw new IllegalArgumentException("too many stars");
        }
        return new Hotel(name);
    }
}
```

Rules that matter in an exam. A static method cannot read instance fields or call instance methods directly, because there is no `this`. A static field is initialised once when the class loads. `static final` on an object type still lets you mutate the object, only the reference is fixed. Constants are written `static final` and named in upper case.

### Records

A record is a class whose whole purpose is to carry a fixed set of values. The compiler writes the private final fields, the constructor, the accessors named after the components, plus `toString`, `equals`, and `hashCode`.

```java
record HotelRow(int hotelId, String name, String city, int stars) { }

HotelRow row = new HotelRow(12, "Danube View", "Budapest", 4);
System.out.println(row.name());          // accessor, no get prefix
System.out.println(row);                 // HotelRow[hotelId=12, name=Danube View, ...]
```

You can add validation and helper methods, but not new instance fields:

```java
record HotelRow(int hotelId, String name, int stars) {
    HotelRow {                            // compact constructor, no parameter list
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("stars must be 1..5");
        }
        name = name == null ? "" : name.trim();   // reassignment is allowed here
    }

    String label() {
        return name + " (" + stars + ")";
    }
}
```

Records are implicitly final and extend `java.lang.Record`, so they cannot extend another class. They can implement interfaces. Use a record for a row, a request, or a result. Use a normal class when the object has mutable state or a lifecycle.

### toString, equals, hashCode

Printing an object without `toString` gives `Hotel@1b6d3586`, which tells you nothing. Override it for anything you print or log. If you override `equals`, override `hashCode` in the same class, or the object breaks inside `HashSet` and `HashMap`.

```java
class Hotel {
    private final String name;
    private final int stars;

    Hotel(String name, int stars) {
        this.name = name;
        this.stars = stars;
    }

    @Override
    public String toString() {
        return "Hotel[" + name + ", " + stars + " stars]";
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof Hotel h)) return false;   // pattern match, Java 16+
        return stars == h.stars && name.equals(h.name);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(name, stars);
    }
}
```

## Examples

### Example 1: a class that cannot hold invalid data

```java
// Data shape: Room { number: int, beds: int, nightly: double }
final class Room {
    private final int number;
    private int beds;
    private double nightly;

    Room(int number, int beds, double nightly) {
        if (number <= 0) {
            throw new IllegalArgumentException("room number must be positive");
        }
        this.number = number;
        setBeds(beds);            // reuse the validation instead of repeating it
        setNightly(nightly);
    }

    int getNumber() { return number; }

    int getBeds() { return beds; }

    void setBeds(int beds) {
        if (beds < 1 || beds > 6) {
            throw new IllegalArgumentException("beds must be 1..6, got " + beds);
        }
        this.beds = beds;
    }

    double getNightly() { return nightly; }

    void setNightly(double nightly) {
        if (nightly < 0) {
            throw new IllegalArgumentException("nightly price cannot be negative");
        }
        this.nightly = nightly;
    }

    double totalFor(int nights) {
        if (nights < 1) {
            throw new IllegalArgumentException("nights must be at least 1");
        }
        return nightly * nights;
    }
}
```

The constructor calls its own setters. That keeps one copy of each rule. The field `number` is final, so it has no setter at all and cannot drift after construction.

### Example 2: static counter and a static factory

```java
// Data shape: each created Hotel increments one shared counter
class Hotel {
    private static int created;
    private static final int MAX_STARS = 5;

    private final String name;
    private final int stars;

    private Hotel(String name, int stars) {
        this.name = name;
        this.stars = stars;
        created++;
    }

    static Hotel of(String name, int stars) {   // the only way in
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        if (stars < 1 || stars > MAX_STARS) {
            throw new IllegalArgumentException("stars must be 1.." + MAX_STARS);
        }
        return new Hotel(name, stars);
    }

    static int createdCount() {
        return created;
    }

    String getName() { return name; }

    int getStars() { return stars; }
}

Hotel a = Hotel.of("Danube View", 4);
Hotel b = Hotel.of("Hilltop", 3);
System.out.println(Hotel.createdCount());   // 2
```

The constructor is private, so callers must go through `of`. A static factory can have a name (`of`, `valueOf`, `from`), can validate before allocating, and can return a cached instance. A constructor can do none of those.

### Example 3: records for rows, classes for behaviour

```java
// Data shape: one row from a CSV line: 12;Danube View;Budapest;4
record HotelRow(int hotelId, String name, String city, int stars) {

    static HotelRow parse(String line) {
        String[] p = line.split(";");
        return new HotelRow(
            Integer.parseInt(p[0]),
            p[1].trim(),
            p[2].trim(),
            Integer.parseInt(p[3].trim())
        );
    }

    boolean inCity(String city) {
        return this.city.equalsIgnoreCase(city);
    }
}

HotelRow row = HotelRow.parse("12;Danube View;Budapest;4");
System.out.println(row.name());            // Danube View
System.out.println(row.inCity("budapest")); // true
System.out.println(row);                   // HotelRow[hotelId=12, ...]
```

No getters, no constructor body, no `toString` to write, and `equals` works for free. That is the right shape for a parsed row that never changes.

### Example 4: a full program, read it top to bottom

```java
// File: HotelDemo.java
// One small program that uses every part of the page.
// Data shape: Hotel { name, city, stars, nightly }, Stay { guestEmail, nights }

final class Hotel {
    private static int created;              // shared by all hotels

    private final String name;               // fixed after construction
    private final String city;
    private int stars;                       // changes through the setter
    private double nightly;

    Hotel(String name, String city, int stars, double nightly) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        this.name = name;
        this.city = city;
        setStars(stars);                     // validate once, reuse
        setNightly(nightly);
        created++;                           // every successful object counts
    }

    String getName() { return name; }

    String getCity() { return city; }

    int getStars() { return stars; }

    double getNightly() { return nightly; }

    void setStars(int stars) {
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("stars must be 1..5, got " + stars);
        }
        this.stars = stars;
    }

    void setNightly(double nightly) {
        if (nightly < 0) {
            throw new IllegalArgumentException("nightly cannot be negative");
        }
        this.nightly = nightly;
    }

    boolean isLuxury() {
        return stars >= 4;
    }

    double totalFor(int nights) {
        if (nights < 1) {
            throw new IllegalArgumentException("nights must be at least 1");
        }
        return nightly * nights;
    }

    @Override
    public String toString() {
        return name + " (" + city + ", " + stars + " stars, " + nightly + "/night)";
    }

    static int createdCount() {
        return created;
    }
}

// A record carries a booking request, it has no behaviour of its own.
record Stay(String guestEmail, int nights) {
    Stay {
        if (guestEmail == null || !guestEmail.contains("@")) {
            throw new IllegalArgumentException("valid guest_email is required");
        }
        if (nights < 1) {
            throw new IllegalArgumentException("nights must be at least 1");
        }
    }
}

public class HotelDemo {

    public static void main(String[] args) {
        Hotel a = new Hotel("Danube View", "Budapest", 4, 92.5);
        Hotel b = new Hotel("Hilltop", "Eger", 3, 61.0);

        // A rejected object never reaches the rest of the program.
        try {
            Hotel bad = new Hotel("Nowhere", "Eger", 9, 40.0);
            System.out.println("not reached: " + bad);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }

        // Polymorphism does not apply here, both variables are Hotel.
        for (Hotel h : java.util.List.of(a, b)) {
            System.out.println(h + " luxury=" + h.isLuxury());
        }

        Stay stay = new Stay("anna@example.com", 3);
        System.out.println("total for " + stay.nights() + " nights at "
                + a.getName() + ": " + a.totalFor(stay.nights()));

        // A setter is the only door to a mutable field.
        a.setStars(5);
        System.out.println("after upgrade: " + a.getStars() + " stars");

        System.out.println("created objects: " + Hotel.createdCount());   // 2
    }
}
```

The static counter prints 2, not 3, because the rejected hotel threw before `created++` ran. That ordering is deliberate: count the object only after every check passed. Note how `main` never touches a field directly. Every read and write goes through a method, which is what encapsulation buys you.

## Common mistakes

- Making every field public. The first caller that writes `-1` teaches you why this fails.
- Writing a getter and setter for a field that should be `final`. The setter is then a public invitation to break the invariant.
- Forgetting `this` when a parameter shadows a field. `name = name;` assigns the parameter to itself and leaves the field `null`.
- Calling an overridable method from a constructor. The subclass fields are still at their defaults, so the method reads half built state.
- Assuming `==` compares content. It compares references. Use `equals` for values, and override `hashCode` beside it.
- Putting logic in a setter that the constructor skips. The object is then valid on one path and not the other.
- Using a record and then wanting a setter. Records are immutable by design; use a class instead.
- Trusting a static mutable field as global state. It is shared by every object, including objects in tests.
- Forgetting that a missing constructor is only free until you add one. After that, `new Hotel()` stops compiling.
- Writing `static` on a method that reads instance fields. The compiler rejects it, and the fix is usually to drop `static`, not to add a parameter.

## Exam checklist

- Can you write a class with private fields, one constructor, validation, getters, one setter, and `toString` from memory?
- Do you know the order `new` runs: memory, default values, constructor body?
- Can you explain why `final` fields must be assigned in every constructor?
- Can you chain constructors with `this(...)` and say why it must be the first line?
- Do you know what breaks when `equals` changes and `hashCode` does not?
- Can you name the four things a record generates for you?
- Can you explain the difference between a static field and an instance field in one sentence?
- Can you spot a setter that skips validation and say what bug it allows?
- Do you know why a private constructor plus a static factory is a valid design?
- Can you read the big example and point to the line where an invalid object is stopped?

