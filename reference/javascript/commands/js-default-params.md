# default parameters

JavaScript command · Functions

Gives a parameter a value when the caller passes undefined.

## Syntax

```js
function greet(name = "Guest") { ... }
```

## Example

```js
function greet(name = "Guest", stars = 3) {
  return `${name}, ${stars} stars`;
}

console.log(greet()); // Guest, 3 stars
```
