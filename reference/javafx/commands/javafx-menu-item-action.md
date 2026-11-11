# MenuItem and accelerator

JavaFX command · Menus

Adds a clickable command to a menu with an optional keyboard shortcut. Shortcut maps to Ctrl on Windows and Linux and Command on macOS.

## Syntax

```java
menuItem.setOnAction(handler); menuItem.setAccelerator(KeyCombination.keyCombination("Shortcut+O"));
```

## Example

```java
MenuItem open = new MenuItem("Open...");
open.setAccelerator(KeyCombination.keyCombination("Shortcut+O"));
open.setOnAction(event -> openFile());

MenuItem exit = new MenuItem("Exit");
exit.setOnAction(event -> Platform.exit());

Menu file = new Menu("File");
file.getItems().addAll(open, new SeparatorMenuItem(), exit);
MenuBar bar = new MenuBar(file);
```

## Details

Use `Ctrl+O` only when the task explicitly says Ctrl, because that breaks the shortcut on macOS.

A menu item is not a node, so it cannot be added to a layout. It lives in a `Menu`, and the `Menu` lives in a `MenuBar` that is placed in the layout like any other control.
