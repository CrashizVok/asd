# Promises

JavaScript topic · Exam Wiki

```js
function loadRooms() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const ok = true;
            if (ok) resolve([{ name: "A" }]);
            else reject(new Error("Network down"));
        }, 500);
    });
}

loadRooms()
    .then((rooms) => console.log(rooms))
    .catch((err) => console.error(err.message))
    .finally(() => console.log("done"));

const [rooms, guests] = await Promise.all([loadRooms(), loadGuests()]);
```

A promise is a future value. `then` handles success, `catch` failure, `finally` always runs. `await` pauses the async function until the promise settles. `Promise.all` waits for all and rejects on the first failure.
