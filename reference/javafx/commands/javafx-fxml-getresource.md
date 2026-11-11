# getClass().getResource(path)

JavaFX command · Loading

Resolves a file from the classpath. A leading slash starts at the classpath root; without it, resolution starts in the caller's package.

## Syntax

```java
getClass().getResource("/fxml/login.fxml")
```

## Example

```java
// Absolute: starts at the classpath root, the safe form.
var absolute = getClass().getResource("/fxml/login.fxml");

// Relative: starts in the package of this class, so it only works next to it.
var relative = getClass().getResource("login.fxml");

// A wrong path returns null, it does not throw. Print it once when in doubt.
System.out.println(absolute);
```

## Details

The file has to reach the output directory. `src/main/resources` is copied by Maven and Gradle; a file left in `src/main/java` may not be, which produces a file visible in the IDE and invisible to the loader.

A null URL then fails inside `load()` with a location message that points at the loader, not at the path. Checking for null early saves the detour:

```java
var url = getClass().getResource("/fxml/login.fxml");
if (url == null) throw new IllegalStateException("login.fxml missing from the classpath");
```
