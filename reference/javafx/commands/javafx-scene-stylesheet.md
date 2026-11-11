# Add a stylesheet

JavaFX command · CSS

Loads a CSS file for one scene. The URL must point at the file on the classpath and must not be null.

## Syntax

```java
scene.getStylesheets().add(url)
```

## Example

```java
// src/main/resources/app.css lands at the classpath root.
var css = getClass().getResource("/app.css");
if (css != null) {
    scene.getStylesheets().add(css.toExternalForm());
}
```

## Details

`getClass().getResource("app.css")` looks in the package of the class. The leading slash means the classpath root, which is where Maven puts `src/main/resources`.

A wrong path returns `null` and `toExternalForm()` throws `NullPointerException` before the window opens. Guard it while developing, and keep the guard in exam code so a missing file costs styling time only.
