# loader.getController()

JavaFX command · Loading

Returns the controller instance created during the load, so data and callbacks can be handed to it.

## Syntax

```java
MyController c = loader.getController();
```

## Example

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/profile.fxml"));
Parent root = loader.load();

ProfileController controller = loader.getController();
controller.setProfile(profile);   // initialize() has already run at this point

```

## Details

The method returns null before `load()` finished, and also when the FXML has no `fx:controller` and no controller was set. Call it only after a successful load.

Because `initialize()` already ran, a setter called here must render the data itself. It cannot expect `initialize()` to pick it up later.

The generic form `loader.<ProfileController>getController()` avoids a cast in code that cannot use a typed local variable.
