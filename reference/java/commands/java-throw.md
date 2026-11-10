# throw and throws

Java command · Exceptions

throw raises an exception. throws declares that a method may pass one to the caller.

## Syntax

```java
throw new IllegalArgumentException("message");
```

## Example

```java
static int parseAge(String text) {
    int age = Integer.parseInt(text);
    if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
    return age;
}

static void readFile() throws IOException {
    Files.readString(Path.of("data.txt"));
}
```
