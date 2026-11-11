# missing hashCode

Java command · Equality

Two equal objects must return the same hashCode, otherwise HashMap and HashSet cannot find them again.

## Syntax

```java
Objects.hash(field1, field2)
```

## Example

```java
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

final class Ref {
    private final String value;
    Ref(String value) { this.value = value; }

    @Override
    public boolean equals(Object other) {
        return other instanceof Ref r && value.equals(r.value);
    }
    // no hashCode: Object.hashCode is based on identity
}

final class FixedRef {
    private final String value;
    FixedRef(String value) { this.value = value; }

    @Override
    public boolean equals(Object other) {
        return other instanceof FixedRef r && value.equals(r.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}

Set<Ref> broken = new HashSet<>();
broken.add(new Ref("AB-12"));
System.out.println(broken.contains(new Ref("AB-12")));        // false

Set<FixedRef> fixed = new HashSet<>();
fixed.add(new FixedRef("AB-12"));
System.out.println(fixed.contains(new FixedRef("AB-12")));    // true
```

## Details

A hash collection reads the hash first and only then compares with `equals` inside that bucket. Two objects that are equal but hash differently never meet, so `contains` answers `false` while `a.equals(b)` answers `true`. The compiler cannot warn about this, which is why every `equals` needs the matching `hashCode` in the same edit.
