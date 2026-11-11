# private interface method

Java command · Interfaces

Java 9 and later. Shared code for default and static methods, invisible to implementing classes.

## Syntax

```java
private ReturnType helper(args) { ... }
```

## Example

```java
interface Receipt {
    double amount();

    default String line() {
        return "total " + money(amount());
    }

    default String depositLine() {
        return "deposit " + money(amount() * 0.3);
    }

    // Not part of the contract: no implementing class can call or override it.
    private String money(double value) {
        return String.format("%.2f EUR", value);
    }
}

class RoomCharge implements Receipt {
    @Override public double amount() { return 180.0; }
}

System.out.println(new RoomCharge().line());          // total 180.00 EUR
System.out.println(new RoomCharge().depositLine());   // deposit 54.00 EUR
```

## Details

Before Java 9 the same helper had to be `public static`, which put it into the contract and into the documentation. A private method may also be static, and it may not be abstract. It exists only to stop two default methods from repeating a format, and it is the one member an implementing class cannot see at all.
