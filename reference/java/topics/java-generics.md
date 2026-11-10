# Generics

Java topic · Exam Wiki

```java
class Box<T> {
    private T value;

    void set(T value) { this.value = value; }
    T get() { return value; }
}

Box<String> box = new Box<>();
box.set("hello");
String text = box.get();
```

`<T>` is a type parameter. Generics catch a wrong type at compile time and avoid casts. Use `List<String>` instead of a raw `List`.
