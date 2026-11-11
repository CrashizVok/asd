# Express error handler

Node.js command · Express

The only middleware with four arguments, which is how Express recognises it. It must be registered after every route.

## Syntax

```js
app.use((err, req, res, next) => { ... })
```

## Example

```js
// File: app.js
import express from "express";

const app = express();
app.use(express.json());

app.get("/api/hotels/:hotel_id", async (req, res, next) => {
  try {
    const hotel = await findHotel(req.params.hotel_id);
    if (!hotel) {
      // A thrown error reaches the handler below
      const error = new Error("Hotel not found");
      error.status = 404;
      throw error;
    }
    res.json(hotel);
  } catch (error) {
    next(error); // async errors are not caught by Express automatically
  }
});

// Four parameters, so Express treats it as the error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message });
});
```
