# Grouped LIKE search

Node.js command · Queries

Searches several text columns with OR while keeping them in one parenthesised group. Escape % and _ so the search word is treated as text.

## Syntax

```js
.where((group) => group.where(...).orWhere(...))
```

## Example

```js
const word = text(request.params.search_word, 'search_word', { max: 80 });
const like = `%${word.replace(/[\\%_]/g, '\\$&')}%`;

const rows = await db('bookings as b')
    .join('customers as c', 'c.email', 'b.customer_email')
    .join('hotels as h', 'h.id', 'b.hotel_id')
    .where((group) => {
        group
            .where('c.first_name', 'like', like)
            .orWhere('c.last_name', 'like', like)
            .orWhere('h.name', 'like', like)
            .orWhere('h.description', 'like', like);
    })
    .orderBy('b.start_date', 'asc')
    .limit(100);

response.json(rows);
```

## Details

Without the callback the SQL becomes `first_name LIKE ? OR ... OR description LIKE ? AND start_date >= ?`, and the last filter applies only to the final OR. The result includes rows the filter was meant to remove.
