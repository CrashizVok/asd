# Classes

JavaScript topic · Exam Wiki

```js
class Room {
    #price; // private field

    constructor(name, price) {
        this.name = name;
        this.#price = price;
    }

    get price() {
        return this.#price;
    }

    label() {
        return `${this.name}: ${this.#price} EUR`;
    }

    static from(row) {
        return new Room(row.name, row.price);
    }
}

const room = new Room("Double", 80);
console.log(room.label());
console.log(Room.from({ name: "Single", price: 50 }).price);
```

A class groups data and behaviour. `constructor` runs on `new`. A `get` accessor is read like a property. `static` belongs to the class, not an instance. `#field` is truly private.
