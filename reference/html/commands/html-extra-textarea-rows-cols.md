# textarea rows and cols

HTML command · Forms

rows and cols set the visible size in characters, not a hard limit. maxlength limits the value and wrap controls soft wrapping.

## Syntax

```html
<textarea rows="5" cols="40"></textarea>
```

## Example

```html
<label for="description">Description</label>
<textarea id="description" name="description"
          rows="5" cols="40" maxlength="500"
          placeholder="What should the guest know?"></textarea>
<!-- CSS width and height usually replace rows and cols -->
```
