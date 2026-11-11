# Scene.getStylesheets()

JavaFX command · CSS

Attaches a CSS file to a scene. The URL must point at a resource on the classpath, not a relative file path.

## Syntax

```java
scene.getStylesheets().add(url.toExternalForm())
```

## Example

```java
Scene scene = new Scene(root, 1040, 640);

URL css = App.class.getResource("/app/app.css");
if (css != null) {
    scene.getStylesheets().add(css.toExternalForm());
}

// In FXML the same thing is one attribute on the root:
// <BorderPane stylesheets="@app.css">
```

## Details

A stylesheet added to the root node applies to that subtree only; added to the scene, it covers dialogs created with that scene as owner as well.

getResource returns null for a missing file and the null check turns a silent styling failure into an obvious one. The leading slash means classpath root, so app/app.css sits in src/main/resources/app/app.css.
