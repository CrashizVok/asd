# defensive copy with List.copyOf

Java command · Encapsulation

Stores an unmodifiable copy of a collection, so the caller cannot change the object's state through the reference it passed in.

## Syntax

```java
this.items = List.copyOf(items);
```

## Example

```java
import java.util.ArrayList;
import java.util.List;

final class PriceList {
    private final List<Long> prices;

    PriceList(List<Long> prices) {
        this.prices = List.copyOf(prices);   // copy now, read only forever
    }

    List<Long> prices() {
        return prices;                       // already unmodifiable, safe to hand out
    }
}

List<Long> raw = new ArrayList<>(List.of(9250L, 6100L));
PriceList list = new PriceList(raw);
raw.clear();                                 // does not reach the object
System.out.println(list.prices().size());    // 2
// list.prices().add(1L);                    // UnsupportedOperationException
```

## Details

Handing out the internal list means any caller can `clear()` it and break the object. `List.copyOf` copies and wraps in one call, and it also rejects `null` elements, which turns a bad argument into an exception at the boundary. For a list that must change later, keep a private `ArrayList` and return `List.copyOf(prices)` from the getter.
