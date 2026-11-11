# express.Router

Node.js command · Express

Groups routes for one resource in a separate file. Paths inside the router are relative to the mount point.

## Syntax

```js
const router = Router(); app.use('/api/hotels', router)
```

## Example

```js
// File: routes/hotels.js
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json([{ hotel_id: 1, name: "Danube View", stars: 4 }]);
});

router.get("/:hotel_id", (req, res) => {
  res.json({ hotel_id: Number(req.params.hotel_id), name: "Danube View" });
});

router.post("/", (req, res) => {
  res.status(201).json({ hotel_id: 2, name: req.body.name });
});

export default router;

// File: app.js
// import hotels from "./routes/hotels.js";
// app.use("/api/hotels", hotels);
```
