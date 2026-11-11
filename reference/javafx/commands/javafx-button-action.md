# Button action

JavaFX command · Controls

Runs the handler when the button is clicked or when it is the default button and Enter is pressed. Reading control values inside the lambda is what makes the form work.

## Syntax

```java
button.setOnAction(event -> handler());
```

## Example

```java
TextField email = new TextField();
Button save = new Button("Save");
save.setDefaultButton(true);

save.setOnAction(event -> {
    // Read at click time. Reading outside would capture the empty field.
    System.out.println("Saving " + email.getText().trim());
});
```

## Details

`setOnAction` replaces the previous handler. If a button and a menu item must run different code, give them separate lambdas that call one shared method.

When two handlers must both run, use `addEventHandler(ActionEvent.ACTION, ...)` instead of calling `setOnAction` twice.
