# error first callback

JavaScript command · Callbacks

The older async style: the last argument is a function, called once with an error or a result. Only one of the two is non null.

## Syntax

```js
fn(args, (error, result) => {})
```

## Example

```js
function loadHotels(callback) {
  setTimeout(() => {
    callback(null, [{ hotel_id: 1, city: "Zurich" }]);
  }, 200);
}

loadHotels((error, hotels) => {
  if (error) return console.error(error.message);
  console.log(hotels.length);
});
```

## Details

The `return` in the error branch is load bearing. Without it the success branch runs with a null result. Nesting several of these calls is what promises were invented to flatten.
