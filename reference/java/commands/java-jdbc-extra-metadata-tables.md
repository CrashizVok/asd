# DatabaseMetaData.getTables

Java command · Metadata

Lists tables as a normal ResultSet. The catalog is the schema name in MySQL and null in SQLite; the types array filters out views.

## Syntax

```java
meta.getTables(catalog, schemaPattern, tablePattern, types)
```

## Example

```java
// Data shape: rows with TABLE_CAT, TABLE_SCHEM, TABLE_NAME, TABLE_TYPE.
try (Connection conn = DriverManager.getConnection(url, user, password)) {
    DatabaseMetaData meta = conn.getMetaData();

    // Catalog is the database name in MySQL. null means "no filter".
    String catalog = conn.getCatalog();

    try (ResultSet tables = meta.getTables(catalog, null, "%", new String[]{"TABLE"})) {
        while (tables.next()) {
            System.out.println(tables.getString("TABLE_NAME")
                    + " (" + tables.getString("TABLE_TYPE") + ")");
        }
    }

    // Columns of one table, without running a query against it.
    try (ResultSet columns = meta.getColumns(catalog, null, "hotels", "%")) {
        while (columns.next()) {
            System.out.println(columns.getString("COLUMN_NAME")
                    + " " + columns.getString("TYPE_NAME")
                    + " nullable=" + columns.getString("IS_NULLABLE"));
        }
    }
}
```

## Details

The four arguments are catalog, schema pattern, table pattern, and types. `null` means no filter for any of them, and `%` is the SQL wildcard. Passing `new String[]{"TABLE"}` excludes views, which otherwise show up next to real tables.

The catalog argument confuses people who come from PostgreSQL. In MySQL the catalog is the database, so `conn.getCatalog()` is the right value and the schema argument stays null. In PostgreSQL it is the other way around. Passing the database name as the schema argument returns zero rows and looks like a missing table.

These calls return ordinary result sets. Close them, and remember that the pattern comparison follows the server's collation, which is case sensitive for table names on Linux MySQL.
