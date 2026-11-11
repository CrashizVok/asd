# AND / OR

Node.js command · Filtering

AND binds tighter than OR. Parenthesise the group you mean, or the query filters something else.

## Syntax

```js
WHERE cond1 AND cond2 | WHERE cond1 OR cond2
```

## Example

```js
-- Wrong: Budapest any stars, or Debrecen with five stars
SELECT id, name FROM hotels
WHERE city = 'Budapest' OR city = 'Debrecen' AND stars = 5;

-- Right: either city, and at least four stars in both
SELECT id, name FROM hotels
WHERE (city = 'Budapest' OR city = 'Debrecen') AND stars >= 4;
```
