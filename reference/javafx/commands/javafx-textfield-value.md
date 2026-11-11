# TextField value

JavaFX command · Controls

Reads the typed text as a String. The prompt is grey hint text and is never returned by getText, so an empty field reads as an empty string, not null.

## Syntax

```java
field.getText(); field.setPromptText(text);
```

## Example

```java
TextField email = new TextField();
email.setPromptText("customer_email");

// Validate on submit, not while the user is still typing.
if (email.getText().isBlank()) {
    errorLabel.setText("Email is required.");
}
```

## Details

Numbers need parsing, and parsing can fail:

```java
int adults;
try {
    adults = Integer.parseInt(adultsField.getText().trim());
} catch (NumberFormatException ex) {
    adults = 0;   // or show an error and return
}
```

For numeric input with a known range, `Spinner<Integer>` avoids the parse and the error case.
