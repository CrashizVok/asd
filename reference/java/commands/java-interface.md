# interface and implements

Java command · OOP

An interface declares a contract. A class can implement several interfaces. Methods are public by default.

## Syntax

```java
interface Payable { void pay(); }
class Bill implements Payable { ... }
```

## Example

```java
interface Payable {
    void pay(double amount);
}

class CardPayment implements Payable {
    public void pay(double amount) {
        System.out.println("Paid " + amount);
    }
}
```
