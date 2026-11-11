# LoadException and its causes

JavaFX command · Errors

The wrapper for nearly every FXML failure. The nested cause names the real problem.

## Syntax

```java
javafx.fxml.LoadException: ...
```

## Example

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/login.fxml"));
try {
    Parent root = loader.load();
    scene.setRoot(root);
} catch (IOException e) {
    // The top message names the element or attribute; the cause names the class,
    // method or field that was not found. Read the cause first.
    Throwable cause = e.getCause() != null ? e.getCause() : e;
    throw new IllegalStateException("login.fxml failed: " + cause.getMessage(), e);
}
```

## Details

The frequent causes, in the order they appear in practice:

- `ClassNotFoundException`: missing or misspelled `<?import?>`, or a wrong class in `fx:controller`.
- location not set: `getResource` returned null, so the path, the slash, or the resource folder is wrong.
- null field later: `fx:id` and field name differ, the field is private without `@FXML`, or the node lives in another file.
- handler not resolved: the `onAction` method is missing, private without `@FXML`, or has a wrong parameter list.
- controller already specified: `setController` was called on a loader whose FXML has `fx:controller`.
- no default constructor: the controller named in `fx:controller` only has constructors with arguments.
- XML parse error: an unclosed tag, an unquoted attribute, or a raw `&` in text. Use `&amp;`.
- access error in a modular project: the controller package is not opened to `javafx.fxml`.
