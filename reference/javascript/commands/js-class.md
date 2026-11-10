# class

JavaScript command · Classes

A template for objects. The constructor runs on new. Methods live on the prototype.

## Syntax

```js
class Name { constructor() {} method() {} }
```

## Example

```js
class Booking {
  constructor(guest, nights) {
    this.guest = guest;
    this.nights = nights;
  }

  get total() {
    return this.nights * 80;
  }
}

const booking = new Booking("Anna", 3);
console.log(booking.total); // 240
```
