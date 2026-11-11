# switch expression

Java command · Control flow

Returns a value from a switch, with no fallthrough. A block case returns with yield, and an enum switch must cover every constant.

## Syntax

```java
var x = switch (value) { case A -> ...; }
```

## Example

```java
// File: Band.java
public class Band {
    enum Season { LOW, HIGH }

    public static void main(String[] args) {
        int nights = 5;

        // a comma separates labels, there is no fallthrough and no break
        String band = switch (nights) {
            case 1, 2 -> "weekend";
            case 3, 4, 5 -> {
                String label = "midweek";
                yield label; // a block case returns with yield
            }
            default -> "long";
        };
        System.out.println(band); // midweek

        // over an enum the switch must cover every constant
        Season season = Season.HIGH;
        int price = switch (season) {
            case LOW -> 80;
            case HIGH -> 160;
        };
        System.out.println(price); // 160
    }
}
```
