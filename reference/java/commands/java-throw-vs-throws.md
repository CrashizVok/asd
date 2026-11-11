# throw and throws

Java command · Exceptions

throw raises one exception object. throws declares which checked types may leave the method.

## Syntax

```java
throw new Type(message);  /  void m() throws Type
```

## Example

```java
class Stars {
    // throws is part of the contract: callers must handle it or declare it.
    static void validate(int stars) throws IllegalArgumentException {
        if (stars < 1 || stars > 5) {
            // throw ends this path immediately with an object that carries data.
            throw new IllegalArgumentException("stars must be 1..5, got " + stars);
        }
    }

    static String label(int stars) throws Exception {
        validate(stars);
        if (stars == 5) {
            throw new Exception("five star hotels need a manual review");
        }
        return stars + " stars";
    }

    public static void main(String[] args) {
        try {
            System.out.println(label(5));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
```

## Details

Declaring IllegalArgumentException in a throws clause is legal but pointless, because it is unchecked. Exam answers usually expect throws only for checked types such as IOException or SQLException.

A method can declare a supertype, but then callers cannot catch the narrow type the compiler knows about. Declare the most specific checked types that can actually escape.
