# Route params and query

Node.js command · Express

Params come from the path pattern and query values come from the URL. Both arrive as strings.

## Syntax

```js
req.params.id, req.query.city
```

## Example

```js
// File: routes/hotels.js
import { Router } from "express";

const router = Router();

// GET /api/hotels/7?city=Budapest&stars=4
router.get("/:hotel_id", (req, res) => {
  const hotelId = Number(req.params.hotel_id);
  const { city, stars } = req.query;

  if (Number.isNaN(hotelId)) {
    return res.status(400).json({ error: "hotel_id must be a number" });
  }

  // Compare loosely, because stars is the string "4"
  const filters = {
    hotel_id: hotelId,
    city: city || null,
    minStars: stars ? Number(stars) : 0
  };

  res.json(filters);
});

export default router;
```
