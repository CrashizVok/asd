# schema.createTable()

Node.js command · Migrations

Builds tables from code in a migration. Types, keys, and constraints are methods on the table builder.

## Syntax

```js
db.schema.createTable('hotels', (table) => { ... })
```

## Example

```js
exports.up = async function up(knex) {
  await knex.schema.createTable('hotels', (table) => {
    table.increments('id').primary();
    table.string('city', 80).notNullable();
    table.string('name', 120).notNullable();
    table.text('description').nullable();
    table.tinyint('stars').notNullable().defaultTo(0);
    table.string('owner_email', 120).notNullable();
    table.string('image', 500).nullable();
    table.foreign('owner_email').references('email').inTable('customers')
      .onUpdate('CASCADE').onDelete('RESTRICT');
    table.check('stars between 0 and 5', [], 'chk_hotels_stars');
    table.engine('InnoDB');
    table.charset('utf8mb4');
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('hotels');
};
```

## Details

Drop in reverse creation order in `down()`, because MySQL refuses to drop a table another table still references. The composite key form is `table.primary(['customer_email', 'hotel_id'])`.
