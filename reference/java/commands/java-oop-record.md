# record

Java command · Records

A compact immutable data class. The compiler writes the private final fields, constructor, accessors, toString, equals, and hashCode.

## Syntax

```java
record Name(Type a, Type b) { }
```

## Example

```java
// Data shape: HotelRow { hotelId: int, name: String, city: String, stars: int }
record HotelRow(int hotelId, String name, String city, int stars) { }

HotelRow row = new HotelRow(12, "Danube View", "Budapest", 4);

System.out.println(row.name());      // Danube View, no get prefix
System.out.println(row);             // HotelRow[hotelId=12, name=Danube View, ...]

HotelRow same = new HotelRow(12, "Danube View", "Budapest", 4);
System.out.println(row.equals(same));   // true, generated from the components

// row.name("Other");  // no setter exists: records are immutable
```

## Details

A record is implicitly `final` and extends `java.lang.Record`, so it cannot extend another class. It can implement interfaces and declare extra methods, but not extra instance fields. Accessors are named after the components, `name()` rather than `getName()`. Use a record for a parsed row, a request, or a result that never changes.
