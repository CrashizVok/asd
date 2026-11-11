# computed total over line items

Java command · Domain model

One small domain model: an immutable invoice sums polymorphic line items and never exposes its internal list.

## Syntax

```java
long totalMinor() { for (LineItem l : lines) sum += l.amountMinor(); }
```

## Example

```java
import java.util.ArrayList;
import java.util.List;

final class Invoice {
    private final String guestEmail;
    private final List<LineItem> lines;

    Invoice(String guestEmail, List<LineItem> lines) {
        this.guestEmail = guestEmail;
        this.lines = List.copyOf(lines);   // own copy, read only
    }

    long totalMinor() {
        long sum = 0;
        for (LineItem line : lines) {
            sum += line.amountMinor();     // each line knows its own price
        }
        return sum;
    }

    String summary() {
        StringBuilder sb = new StringBuilder("invoice for " + guestEmail + "\n");
        for (LineItem line : lines) {
            sb.append(String.format("  %-24s %7d%n", line.label(), line.amountMinor()));
        }
        return sb.append(String.format("  %-24s %7d%n", "total", totalMinor())).toString();
    }
}

// LineItem is defined in java-oop-extra-record-interface.
List<LineItem> lines = new ArrayList<>();
lines.add(new RoomCharge(12, 3, 9250));
lines.add(new ExtraCharge("breakfast", 2400));

Invoice invoice = new Invoice("anna@example.com", lines);
lines.clear();                             // the invoice keeps its own copy
System.out.println(invoice.summary());
System.out.println(invoice.totalMinor());  // 30150
```

## Details

The arithmetic lives in one method, so a new line type only has to implement `label()` and `amountMinor()` to appear on the invoice. The class owns its list, the records own their values, and nothing outside can edit either. Totals are held in minor units as `long` so the sum never picks up a floating point rounding error.
