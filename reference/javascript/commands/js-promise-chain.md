# chaining

JavaScript command · Promises

Runs steps in order without nesting. An error skips every then until the next catch.

## Syntax

```js
p.then(f).then(g).catch(h)
```

## Example

```js
loadHotel(7)
  .then((hotel) => loadOwner(hotel.owner_email))
  .then((owner) => console.log(owner.first_name))
  .catch((error) => console.error(error.message));
```
