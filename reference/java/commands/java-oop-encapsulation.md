# private fields

Java command · Encapsulation

Hides state behind the class boundary. Other classes can only change it through the methods you provide.

## Syntax

```java
private Type field;
```

## Example

```java
class Hotel {
    private int stars = 3;     // no outside write possible

    int getStars() {
        return stars;
    }

    void setStars(int stars) {
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("stars must be 1..5");
        }
        this.stars = stars;
    }
}

Hotel h = new Hotel();
h.setStars(4);
// System.out.println(h.stars);   // compile error: stars has private access
```

## Details

Encapsulation keeps one rule in one place. When `stars` can only be written by `setStars`, no future class can store `9` without passing the check. A class with public fields cannot make that promise.
