# Switching screens with scene.setRoot()

JavaFX command · Navigation

Replaces the visible screen while keeping the stage, its size, and the scene stylesheets.

## Syntax

```java
scene.setRoot(new FXMLLoader(url).load());
```

## Example

```java
// One stage, one scene, many roots. The stylesheet list and the window
// size belong to the scene and the stage, so they survive the swap.
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/dashboard.fxml"));
Parent root = loader.load();

DashboardController controller = loader.getController();
controller.setApp(this);          // give the screen a way back
scene.setRoot(root);
stage.setTitle("Dashboard");
```

## Details

Building a new `Scene` per screen throws away the stylesheets and resets the size, which is why beginners end up re adding CSS on every screen.

Navigation belongs to whoever owns the stage. Controllers call one method such as `app.showLogin()` and never touch the stage themselves, so the title and the current screen have a single owner.

A second `Stage` is for dialogs and tool windows. For main navigation, swap the root.
