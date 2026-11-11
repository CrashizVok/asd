# iframe sandbox

HTML command · Media

sandbox restricts what the embedded page may do: no scripts, forms or same origin access unless you allow them. title names the frame for screen readers.

## Syntax

```html
<iframe src="map.html" sandbox="allow-scripts" title="Map"></iframe>
```

## Example

```html
<iframe src="widgets/booking.html"
        sandbox="allow-forms allow-scripts"
        loading="lazy"
        title="Booking widget"
        width="400" height="300"></iframe>
<!-- without allow-same-origin the frame gets a unique origin -->
```
