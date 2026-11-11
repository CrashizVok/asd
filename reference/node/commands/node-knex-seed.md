# seed:run

Node.js command · Migrations

Fills a development database with test rows. Seeds run in filename order, which is why they are numbered.

## Syntax

```js
npx knex seed:run --knexfile knexfile.cjs
```

## Example

```js
// db/seeds/01_hotels.cjs
// Delete before insert, child rows first, so the seed is repeatable.
exports.seed = async function seed(knex) {
  await knex('bookings').del();
  await knex('hotels').del();
  await knex('customers').del();

  await knex('customers').insert([
    { email: 'anna.kovacs@example.com', first_name: 'Anna', last_name: 'Kovacs', birthday: '1990-05-12' },
    { email: 'ben.nagy@example.com', first_name: 'Ben', last_name: 'Nagy', birthday: '1985-11-03' },
  ]);

  await knex('hotels').insert([
    { city: 'Budapest', name: 'Danube View', stars: 4, owner_email: 'anna.kovacs@example.com' },
    { city: 'Eger', name: 'Hill House', stars: 3, owner_email: 'ben.nagy@example.com' },
  ]);
};

// npx knex seed:run --knexfile knexfile.cjs
// One file only: npx knex seed:run --specific=01_hotels.cjs
```
