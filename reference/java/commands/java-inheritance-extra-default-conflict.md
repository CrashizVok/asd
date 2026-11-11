# Interface.super.method()

Java command · Interfaces

Picks one default method when a class implements two interfaces that declare the same signature.

## Syntax

```java
Type.super.method();
```

## Example

```java
interface Billable {
    double amount();

    default String label() { return "amount " + amount(); }
}

interface Auditable {
    String auditRef();

    default String label() { return "audit " + auditRef(); }
}

class InvoiceLine implements Billable, Auditable {
    @Override public double amount() { return 277.5; }

    @Override public String auditRef() { return "INV-7"; }

    // Without this override the class does not compile, and the error names
    // both interfaces.
    @Override
    public String label() {
        return Billable.super.label() + " / " + Auditable.super.label();
    }
}

System.out.println(new InvoiceLine().label());
// amount 277.5 / audit INV-7
```

## Details

The qualified form is legal only inside a class that implements the interface, and only for a direct superinterface. Outside the class there is no syntax for choosing a default method, which is the reason a conflict must be settled here rather than at the call site. If one interface already extends the other, the more specific default wins and the class needs no override.
