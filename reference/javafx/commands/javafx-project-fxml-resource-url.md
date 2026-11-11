# Class.getResource()

JavaFX command · Project

Finds a file on the classpath. The leading slash starts at the classpath root; without it the lookup starts in the caller package.

## Syntax

```java
getClass().getResource("/app/bookings.fxml")
```

## Example

```java
// src/main/resources/app/bookings.fxml -> /app/bookings.fxml
URL fxml = getClass().getResource("/app/bookings.fxml");

// Relative form, valid only from a class in package app:
URL same = getClass().getResource("bookings.fxml");

if (fxml == null) {
    throw new IllegalStateException("check src/main/resources");
}
```

## Details

Maven copies src/main/resources into target/classes, so the path in getResource is the path under resources, not the path on disk. An IDE that runs the class from a stale target directory will miss a file you can see in the project tree; a rebuild fixes it.

getClass() resolves relative paths against the package of the calling class, which changes when the class moves. The absolute form with a slash is the safer habit.
