# Style class

JavaFX command · CSS

Adds a CSS class to a node so a stylesheet can target it. One node can carry several classes, and every control already has its type class.

## Syntax

```java
node.getStyleClass().add("class-name")
```

## Example

```java
Label total = new Label("0");
total.getStyleClass().add("total");

VBox card = new VBox(4);
card.getStyleClass().addAll("card", "card-compact");
```

## Details

CSS for those classes:

```css
.total {
    -fx-font-size: 18px;
    -fx-font-weight: bold;
}

.card {
    -fx-background-color: white;
    -fx-padding: 10;
    -fx-background-radius: 8;
}
```

Pseudo classes add state without extra Java code: `:hover`, `:focused`, `:selected`, `:disabled`, `:empty`. An id selector (`#total`) is possible through `setId`, but ids are unique by contract and style classes are the safer habit.
