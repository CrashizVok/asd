# default method

Java command · Interfaces

A method with a body inside an interface. Implementing classes inherit it and may override it.

## Syntax

```java
default ReturnType name() { ... }
```

## Example

```java
interface Payable {
    double amount();

    default String receiptLine() {
        return "amount due: " + String.format("%.2f", amount());
    }
}

class RoomBooking implements Payable {
    private final double total;

    RoomBooking(double total) { this.total = total; }

    @Override public double amount() { return total; }

    // receiptLine() is inherited, no code needed here
}

System.out.println(new RoomBooking(277.5).receiptLine());
// amount due: 277.50
```

## Details

A default method lets you add behaviour to an interface without breaking every class that implements it. If two interfaces provide the same default method, the class must override it and pick one with `InterfaceName.super.method()`. An interface can also declare `static` methods, called on the interface name, and private helper methods used only inside the interface.
