# Controller field for fx:id

JavaFX command · Injection

Injects the node whose fx:id equals the field name. Public fields work too; @FXML allows private ones.

## Syntax

```java
@FXML private TextField emailField;
```

## Example

```java
package sample;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;

public class FormController {

    @FXML private TextField cityField;   // filled from fx:id="cityField"
    @FXML private Label hintLabel;      // filled from fx:id="hintLabel"

    private int edits;                   // plain state, never injected
}
```

## Details

The declared type must be assignable from the node in the FXML. A `Label` field for a `TextField` element fails during load.

Injection order inside one load: objects constructed, ids stored, fields injected, then `initialize()`. That is why a field read in the constructor is null and a field read in `initialize()` is ready.

A private field without `@FXML` is skipped without a warning. This is the single most common null pointer in FXML code.
