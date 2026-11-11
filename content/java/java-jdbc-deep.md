---
id: java-jdbc-deep
lang: Java
title: JDBC
---

# JDBC

## Simplest form

```java
// Data shape: Connection -> PreparedStatement -> ResultSet, one row at a time.
// url: jdbc:mysql://host:3306/database, then user and password.
// rs.next() moves the cursor and returns false when no rows are left.
try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(
             "SELECT name, stars FROM hotels WHERE hotel_id = ?")) {

    ps.setInt(1, 1); // Placeholder indexes start at 1, not 0.

    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            System.out.println(rs.getString("name") + " " + rs.getInt("stars"));
        }
    }
}
```

## What it does

JDBC is the standard Java API for talking to a relational database. Your code writes SQL, the driver translates it into the database vendor's wire protocol, and the result comes back as rows you read one at a time.

Four objects carry almost all of the work. `DriverManager` finds a driver for the URL and opens a `Connection`. The connection creates a `PreparedStatement` for one SQL statement with placeholders. Executing it returns a `ResultSet` for queries, or a row count for updates. Each of the four has a `close()` method, and each one should be closed in the reverse order of creation.

## The driver

JDBC 4 loads drivers automatically from the classpath through `ServiceLoader`. Putting the driver jar on the classpath is enough; `Class.forName("com.mysql.cj.jdbc.Driver")` is only needed for old drivers or unusual class loader setups, and `Class.forName` failures surface as `ClassNotFoundException`, not `SQLException`.

For MySQL the artifact is `mysql-connector-j` and the class is `com.mysql.cj.jdbc.Driver`. For SQLite the class is `org.sqlite.JDBC` and the URL has no host or credentials.

```sh
# Linux and macOS classpath separator is a colon.
javac -cp mysql-connector-j-8.4.0.jar BookingRepository.java
java -cp .:mysql-connector-j-8.4.0.jar BookingRepository
```

```java
// SQLite form, useful for a laptop demo with no server.
String url = "jdbc:sqlite:bookings.db";
try (Connection conn = DriverManager.getConnection(url)) {
    // No user or password arguments for SQLite.
}
```

A missing driver shows up as `No suitable driver found for jdbc:mysql://...` even when the jar exists, usually because the jar is not on the runtime classpath or the URL prefix is misspelled.

## The URL

The URL names the driver, the host, the port, and the database, in that order.

```text
jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC
```

- `jdbc` is the protocol.
- `mysql` selects the driver.
- `localhost:3306` is the server.
- `bookings` is the schema.
- The query string holds driver options. `serverTimezone=UTC` avoids timestamp shifts with Connector/J 8, and `useSSL=false` is fine for a local exam database.

Credentials go in `getConnection(url, user, password)`, not in the URL. A password in the URL ends up in logs and shell history.

## Connection

`DriverManager.getConnection` performs the handshake and returns an open connection. Treat it as a scarce resource: opening one costs a network round trip and a database process. Every `connect()` call returns a new physical connection unless you use a pool.

The `Connection` object also controls transactions, reports metadata, and creates statements. It is not thread safe. One connection belongs to one thread at a time, which is why server code uses a pool rather than a shared static connection.

```java
try (Connection conn = DriverManager.getConnection(url, user, password)) {
    System.out.println(conn.getMetaData().getDatabaseProductName());
    System.out.println("autoCommit: " + conn.getAutoCommit());
}
```

Closing the connection closes every statement and result set created from it. That does not excuse you from closing them explicitly, because a long method can hold cursors and server resources far longer than needed.

## PreparedStatement

`PreparedStatement` is a `Statement` with placeholders. You write `?` where a value goes, then bind values by index before executing. The driver sends the SQL text and the values separately, which is both the defense against SQL injection and a chance for the server to reuse a parsed plan.

```java
String sql = "SELECT hotel_id, name, stars FROM hotels WHERE city = ? AND stars >= ? ORDER BY stars DESC";
try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    ps.setString(1, "Budapest");
    ps.setInt(2, 4);

    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getInt("hotel_id") + " " + rs.getString("name"));
        }
    }
}
```

Binding rules that matter in practice:

- Indexes start at 1 and follow the order of the `?` marks.
- `setString`, `setInt`, `setLong`, `setDouble`, `setBoolean`, `setBigDecimal`, `setDate`, `setTimestamp` cover the common types.
- Use `setNull(index, Types.VARCHAR)` for a real SQL NULL. `setString(index, null)` works with some drivers but is not portable.
- Placeholders stand for values only. You cannot bind a table name, a column name, or `ASC`/`DESC`. Those must come from a whitelist in your code.
- Unbound parameters are an error at execute time, and the message usually names the index.

A plain `Statement` is fine for SQL with no user input, such as a fixed DDL statement. The moment a value comes from a form, a file, or another query, use `PreparedStatement`.

### executeQuery, executeUpdate, execute

`executeQuery` returns a `ResultSet` and is meant for `SELECT`. `executeUpdate` returns an int row count and is meant for `INSERT`, `UPDATE`, `DELETE`, and DDL. `execute` returns a boolean and is for statements that may return either, or multiple results.

Calling the wrong one throws `SQLException` with a message about the statement not returning a result set. The row count from `executeUpdate` is also how you detect a missing row: an update that matched nothing returns 0, not an error.

## ResultSet

A `ResultSet` is a cursor over rows. It starts before the first row, `next()` advances and returns false at the end. Reading a column before the first `next()` throws.

Values can be read by label or by index. Labels are easier to read and survive a column reorder in the query; indexes are faster and survive duplicate labels.

```java
try (ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
        int hotelId = rs.getInt("hotel_id");
        String name = rs.getString("name");
        int stars = rs.getInt("stars");

        // getInt returns 0 for SQL NULL. Only wasNull tells the two apart.
        Integer nullableStars = rs.getInt("stars");
        if (rs.wasNull()) {
            nullableStars = null;
        }
        System.out.println(hotelId + " " + name + " " + nullableStars);
    }
}
```

Null handling deserves a second look. `getInt` on a NULL column returns 0, `getBoolean` returns false, and `getString` returns null. If 0 is a legal value, check `wasNull()` right after the getter.

Dates need one conversion. `setDate` takes `java.sql.Date`, and reading gives the same type, so convert at the boundary:

```java
ps.setDate(3, java.sql.Date.valueOf(LocalDate.of(2024, 5, 1)));
// ...
LocalDate start = rs.getDate("start_date").toLocalDate();
```

JDBC 4.2 also allows `rs.getObject("start_date", LocalDate.class)`, which Connector/J 8 supports. The `java.sql.Date` route works with every driver, so it is the safer exam answer.

The default result set is forward-only and read-only. Calling `absolute`, `previous`, or `updateString` on it throws `SQLFeatureNotSupportedException`. Ask for a scrollable or updatable result set in `createStatement` only when you truly need one.

## Examples

The next examples build from one statement to a complete repository.

### Example 1: create, read, update, delete

A create, read, update, delete sequence with parameters looks like this. Each statement is short, and the shape repeats.

```java
// CREATE
String insert = "INSERT INTO hotels (city, name, description, stars, owner_email) VALUES (?, ?, ?, ?, ?)";
try (PreparedStatement ps = conn.prepareStatement(insert, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, "Budapest");
    ps.setString(2, "Hotel Sunrise");
    ps.setString(3, "Quiet hotel near the river");
    ps.setInt(4, 4);
    ps.setString(5, "owner@example.com");
    ps.executeUpdate();

    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) {
            System.out.println("new hotel_id: " + keys.getInt(1));
        }
    }
}

// READ
String select = "SELECT hotel_id, name, stars FROM hotels WHERE city = ?";
// ... executeQuery and rs.next() as above

// UPDATE
String update = "UPDATE hotels SET stars = ? WHERE hotel_id = ?";
try (PreparedStatement ps = conn.prepareStatement(update)) {
    ps.setInt(1, 5);
    ps.setInt(2, 1);
    int changed = ps.executeUpdate();
    System.out.println("rows changed: " + changed);
}

// DELETE
String delete = "DELETE FROM bookings WHERE booking_id = ?";
try (PreparedStatement ps = conn.prepareStatement(delete)) {
    ps.setInt(1, 7);
    ps.executeUpdate();
}
```

`Statement.RETURN_GENERATED_KEYS` asks the driver for auto-increment values. Read them from the result set returned by `getGeneratedKeys()`, not from a second `SELECT LAST_INSERT_ID()`. The second query is a race in any database that serves more than one connection.

### Example 2: SQL injection and the prepared fix

This is the failure that makes the news. A query built by concatenation lets the input change the SQL grammar.

```java
// BROKEN: never do this with user input.
String city = request.getParameter("city");
String sql = "SELECT hotel_id, name FROM hotels WHERE city = '" + city + "'";
```

If the user sends `Budapest' OR '1'='1` the condition becomes true for every row. If the driver allows multiple statements, `'; DROP TABLE bookings; --` can do worse. A login form built this way accepts `' OR '1'='1' --` as a valid email.

The prepared version binds the value as data. Quotes inside the value are escaped by the driver and never parsed as SQL.

```java
String sql = "SELECT hotel_id, name FROM hotels WHERE city = ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, city); // The whole string is one value, even if it contains quotes.
    // ...
}
```

Two limits are worth saying out loud. Placeholders cannot replace identifiers, so a dynamic sort column needs a whitelist map, not string concatenation. And a prepared statement does not make a badly designed query safe from authorization problems: a user can still ask for another customer's bookings unless the SQL includes the owner condition.

### Example 3: transactions with commit and rollback

By default a connection runs in autoCommit mode, so every statement commits on its own. A transaction groups statements so they succeed or fail together.

```java
String sql = "UPDATE hotels SET stars = ? WHERE hotel_id = ?";

try (Connection conn = DriverManager.getConnection(url, user, password)) {
    boolean originalAutoCommit = conn.getAutoCommit();
    conn.setAutoCommit(false);

    try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setInt(1, 5);
        ps.setInt(2, 1);
        if (ps.executeUpdate() != 1) {
            throw new SQLException("hotel 1 is missing");
        }

        ps.setInt(1, 4);
        ps.setInt(2, 2);
        if (ps.executeUpdate() != 1) {
            throw new SQLException("hotel 2 is missing");
        }

        // Both updates become visible together.
        conn.commit();
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    } finally {
        // Important when the connection comes from a pool and will be reused.
        conn.setAutoCommit(originalAutoCommit);
    }
}
```

Things that break transactions in real code:

- Leaving autoCommit true and wondering why a later failure did not undo the first insert.
- Catching the exception, logging it, and forgetting to roll back. The connection returns to the pool with an open transaction.
- Running DDL inside a transaction in MySQL. `CREATE`, `ALTER`, and `DROP` cause an implicit commit, so earlier work is committed whether you like it or not.
- Holding a transaction open while waiting for user input. Locks pile up and other sessions time out.
- Assuming every storage engine supports transactions. MySQL's InnoDB does; older MyISAM tables do not.

Longer units of work can use savepoints, which roll back only part of the transaction.

```java
String sql = "UPDATE hotels SET stars = ? WHERE hotel_id = ?";

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    conn.setAutoCommit(false);
    Savepoint afterFirst = conn.setSavepoint("after_first");

    try {
        ps.setInt(1, 5);
        ps.setInt(2, 1);
        ps.executeUpdate(); // keep this one

        ps.setInt(1, 6);
        ps.setInt(2, 2);
        ps.executeUpdate(); // stars 6 violates a CHECK constraint
        conn.commit();
    } catch (SQLException e) {
        conn.rollback(afterFirst); // undo only the failed second update
        conn.commit();
        System.out.println("second update rejected: " + e.getMessage());
    }
}
```

### Example 4: batch insert

A batch sends many statements in one round trip. Without it, a thousand inserts mean a thousand network waits.

```java
String sql = "INSERT INTO bookings (customer_email, hotel_id, start_date, end_date, adults, children) "
        + "VALUES (?, ?, ?, ?, ?, ?)";

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    conn.setAutoCommit(false);
    try {
        for (Booking booking : bookings) {
            ps.setString(1, booking.customerEmail());
            ps.setInt(2, booking.hotelId());
            ps.setDate(3, java.sql.Date.valueOf(booking.startDate()));
            ps.setDate(4, java.sql.Date.valueOf(booking.endDate()));
            ps.setInt(5, booking.adults());
            ps.setInt(6, booking.children());
            ps.addBatch();
        }

        int[] counts = ps.executeBatch();
        conn.commit();
        System.out.println("statements: " + counts.length);
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    }
}
```

`executeBatch` returns one count per statement. A driver may return `Statement.SUCCESS_NO_INFO` (-2) instead of a real count, so do not assume every element is 1. MySQL also benefits from `rewriteBatchedStatements=true` in the URL, which rewrites the batch into multi-row inserts.

Batch size matters. Very large batches consume memory on both sides and make a failure expensive to diagnose. A few hundred to a few thousand rows per batch is a normal range.

### Example 5: a complete repository program

The schema assumes MySQL 8 and InnoDB. Run the DDL once, or let `createSchema()` do it.

```sql
CREATE TABLE IF NOT EXISTS hotels (
    hotel_id INT PRIMARY KEY AUTO_INCREMENT,
    city VARCHAR(80) NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    stars INT NOT NULL,
    owner_email VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_email VARCHAR(120) NOT NULL,
    hotel_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    adults INT NOT NULL,
    children INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_booking_hotel FOREIGN KEY (hotel_id) REFERENCES hotels (hotel_id)
);
```

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * A small repository that shows the whole JDBC surface in one place.
 *
 * Run:
 *   javac -cp mysql-connector-j-8.4.0.jar BookingRepository.java
 *   java -cp .:mysql-connector-j-8.4.0.jar BookingRepository
 *
 * The URL and credentials are placeholders. Point them at a local schema
 * named bookings, or change the database name in the URL.
 */
public class BookingRepository {

    private static final String URL =
            "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    /** One hotel row. A record is enough because this class only reads them. */
    record Hotel(int hotelId, String city, String name, int stars, String ownerEmail) {
    }

    /** One booking row. bookingId is 0 until the database assigns it. */
    record Booking(int bookingId, String customerEmail, int hotelId,
                   LocalDate startDate, LocalDate endDate, int adults, int children) {

        long nights() {
            return ChronoUnit.DAYS.between(startDate, endDate);
        }
    }

    /** Every method opens and closes its own connection. A pool would change this. */
    private Connection connect() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    /** DDL is idempotent, so running the program twice is safe. */
    void createSchema() throws SQLException {
        String hotels = """
                CREATE TABLE IF NOT EXISTS hotels (
                    hotel_id INT PRIMARY KEY AUTO_INCREMENT,
                    city VARCHAR(80) NOT NULL,
                    name VARCHAR(120) NOT NULL,
                    description TEXT,
                    stars INT NOT NULL,
                    owner_email VARCHAR(120) NOT NULL
                )
                """;
        String bookings = """
                CREATE TABLE IF NOT EXISTS bookings (
                    booking_id INT PRIMARY KEY AUTO_INCREMENT,
                    customer_email VARCHAR(120) NOT NULL,
                    hotel_id INT NOT NULL,
                    start_date DATE NOT NULL,
                    end_date DATE NOT NULL,
                    adults INT NOT NULL,
                    children INT NOT NULL DEFAULT 0,
                    CONSTRAINT fk_booking_hotel FOREIGN KEY (hotel_id)
                        REFERENCES hotels (hotel_id)
                )
                """;

        // Two statements, one connection, both closed by try-with-resources.
        try (Connection conn = connect();
             Statement st = conn.createStatement()) {
            st.executeUpdate(hotels);
            st.executeUpdate(bookings);
        }
    }

    /** Inserts one hotel and returns the generated key. */
    int insertHotel(String city, String name, String description, int stars, String ownerEmail)
            throws SQLException {

        String sql = "INSERT INTO hotels (city, name, description, stars, owner_email) "
                + "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = connect();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, city);
            ps.setString(2, name);
            ps.setString(3, description);
            ps.setInt(4, stars);
            ps.setString(5, ownerEmail);

            int rows = ps.executeUpdate();
            if (rows != 1) {
                throw new SQLException("hotel insert affected " + rows + " rows");
            }

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    return keys.getInt(1);
                }
            }
            throw new SQLException("hotel insert returned no generated key");
        }
    }

    /** Reads hotels in one city, best rated first. */
    List<Hotel> findHotelsByCity(String city) throws SQLException {
        String sql = "SELECT hotel_id, city, name, stars, owner_email "
                + "FROM hotels WHERE city = ? ORDER BY stars DESC, name";

        List<Hotel> hotels = new ArrayList<>();
        try (Connection conn = connect();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, city);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    hotels.add(new Hotel(
                            rs.getInt("hotel_id"),
                            rs.getString("city"),
                            rs.getString("name"),
                            rs.getInt("stars"),
                            rs.getString("owner_email")));
                }
            }
        }
        return hotels;
    }

    /** Inserts a booking and returns its generated id. */
    int insertBooking(Booking booking) throws SQLException {
        String sql = "INSERT INTO bookings "
                + "(customer_email, hotel_id, start_date, end_date, adults, children) "
                + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = connect();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, booking.customerEmail());
            ps.setInt(2, booking.hotelId());
            ps.setDate(3, java.sql.Date.valueOf(booking.startDate()));
            ps.setDate(4, java.sql.Date.valueOf(booking.endDate()));
            ps.setInt(5, booking.adults());
            ps.setInt(6, booking.children());

            int rows = ps.executeUpdate();
            if (rows != 1) {
                throw new SQLException("booking insert affected " + rows + " rows");
            }

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    return keys.getInt(1);
                }
            }
            throw new SQLException("booking insert returned no generated key");
        }
    }

    /**
     * Moves a booking to another hotel inside one transaction.
     * The hotel must exist and the booking must exist, or nothing changes.
     */
    void moveBooking(int bookingId, int newHotelId) throws SQLException {
        String hotelExists = "SELECT 1 FROM hotels WHERE hotel_id = ?";
        String move = "UPDATE bookings SET hotel_id = ? WHERE booking_id = ?";

        try (Connection conn = connect()) {
            boolean originalAutoCommit = conn.getAutoCommit();
            conn.setAutoCommit(false);

            try (PreparedStatement check = conn.prepareStatement(hotelExists);
                 PreparedStatement update = conn.prepareStatement(move)) {

                check.setInt(1, newHotelId);
                try (ResultSet rs = check.executeQuery()) {
                    if (!rs.next()) {
                        throw new SQLException("hotel " + newHotelId + " does not exist");
                    }
                }

                update.setInt(1, newHotelId);
                update.setInt(2, bookingId);
                int rows = update.executeUpdate();
                if (rows != 1) {
                    throw new SQLException("booking " + bookingId + " does not exist");
                }

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } finally {
                // A pooled connection must go back in the state it arrived in.
                conn.setAutoCommit(originalAutoCommit);
            }
        }
    }

    /** Inserts many bookings in one batch and one transaction. */
    int[] insertBookings(List<Booking> bookings) throws SQLException {
        String sql = "INSERT INTO bookings "
                + "(customer_email, hotel_id, start_date, end_date, adults, children) "
                + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = connect();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            boolean originalAutoCommit = conn.getAutoCommit();
            conn.setAutoCommit(false);

            try {
                for (Booking booking : bookings) {
                    ps.setString(1, booking.customerEmail());
                    ps.setInt(2, booking.hotelId());
                    ps.setDate(3, java.sql.Date.valueOf(booking.startDate()));
                    ps.setDate(4, java.sql.Date.valueOf(booking.endDate()));
                    ps.setInt(5, booking.adults());
                    ps.setInt(6, booking.children());
                    ps.addBatch();
                }

                int[] counts = ps.executeBatch();
                conn.commit();
                return counts;

            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(originalAutoCommit);
            }
        }
    }

    /** One aggregate row per hotel: how many bookings and how many nights. */
    List<String> nightlyReport(String city) throws SQLException {
        String sql = """
                SELECT h.name,
                       COUNT(*) AS booking_count,
                       SUM(DATEDIFF(b.end_date, b.start_date)) AS nights
                FROM bookings b
                JOIN hotels h ON h.hotel_id = b.hotel_id
                WHERE h.city = ?
                GROUP BY h.hotel_id, h.name
                ORDER BY nights DESC, h.name
                """;

        List<String> lines = new ArrayList<>();
        try (Connection conn = connect();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, city);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    lines.add(rs.getString("name")
                            + ": " + rs.getInt("booking_count") + " bookings, "
                            + rs.getInt("nights") + " nights");
                }
            }
        }
        return lines;
    }

    public static void main(String[] args) {
        BookingRepository repository = new BookingRepository();

        try {
            repository.createSchema();

            // Seed data uses generated keys, so the ids are never hard-coded.
            int sunrise = repository.insertHotel("Budapest", "Hotel Sunrise",
                    "Quiet hotel near the river", 4, "owner@example.com");
            int park = repository.insertHotel("Budapest", "Hotel Park",
                    "Family hotel with a large garden", 5, "owner2@example.com");

            int firstBooking = repository.insertBooking(new Booking(0,
                    "jane.doe@example.com", sunrise,
                    LocalDate.of(2024, 5, 1), LocalDate.of(2024, 5, 4), 2, 0));

            System.out.println("bookings in Budapest:");
            for (Hotel hotel : repository.findHotelsByCity("Budapest")) {
                System.out.println("  " + hotel.hotelId() + " " + hotel.name()
                        + " (" + hotel.stars() + " stars)");
            }

            repository.moveBooking(firstBooking, park);

            int[] counts = repository.insertBookings(List.of(
                    new Booking(0, "john.smith@example.com", sunrise,
                            LocalDate.of(2024, 6, 1), LocalDate.of(2024, 6, 3), 1, 1),
                    new Booking(0, "anna.kovacs@example.com", park,
                            LocalDate.of(2024, 6, 10), LocalDate.of(2024, 6, 15), 2, 2)));

            System.out.println("batch statements: " + counts.length);

            System.out.println("report:");
            for (String line : repository.nightlyReport("Budapest")) {
                System.out.println("  " + line);
            }

        } catch (SQLException e) {
            // SQLState is the standard code, error code is vendor specific.
            System.out.println("SQLState: " + e.getSQLState());
            System.out.println("error code: " + e.getErrorCode());
            System.out.println("message: " + e.getMessage());
        }
    }
}
```

Read the program in three passes. First the resource boundaries: every method opens its own connection and closes it with try-with-resources. Then the SQL: every value that came from outside is bound with a placeholder, and only the fixed statement text is concatenated. Finally the transaction: `moveBooking` sets autoCommit false, commits on success, rolls back on `SQLException`, and restores the flag in `finally`.

The report query joins `bookings` to `hotels`, groups by hotel, and uses `DATEDIFF` for nights. That is MySQL syntax. In SQLite the equivalent is `julianday(end_date) - julianday(start_date)`, and in PostgreSQL it is `end_date - start_date`. Keep vendor specific date math out of the Java layer.

## More examples

The examples above isolate one call at a time. What follows is the code you actually ship: a row printer that survives unknown columns, a full CRUD cycle around generated keys, savepoints over a batch, a chunked upsert, a metadata probe, and a repository that assembles its WHERE clause from optional filters.

### Example 6: reading any row, NULL included

A generic printer has to work when the query changes next week. `ResultSetMetaData` supplies the labels and the type names, so the loop never hard-codes a column.

```java
// File: ResultSetNulls.java
// Data shape: one row -> column label, JDBC type name, boxed value or null.
// Compile: javac ResultSetNulls.java
// Running needs a live database; the row walk is the part worth memorising.

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public class ResultSetNulls {

    private static final String URL =
            "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";

    /** Prints any row without assuming which columns are nullable or what type they are. */
    static void dumpRow(ResultSet rs) throws SQLException {
        ResultSetMetaData meta = rs.getMetaData();

        for (int col = 1; col <= meta.getColumnCount(); col++) {
            String label = meta.getColumnLabel(col);
            String type = meta.getColumnTypeName(col);

            // getObject hands back null for SQL NULL and the driver's own Java class otherwise.
            Object value = rs.getObject(col);
            if (rs.wasNull()) {
                System.out.printf("%-14s %-10s NULL%n", label, type);
                continue;
            }
            System.out.printf("%-14s %-10s %s%n", label, type, value);
        }
    }

    /** A nullable int column needs wasNull, because 0 is a legal star count. */
    static Integer nullableStars(ResultSet rs) throws SQLException {
        int raw = rs.getInt("stars");
        return rs.wasNull() ? null : raw;
    }

    public static void main(String[] args) throws SQLException {
        String sql = "SELECT hotel_id, city, name, stars, description "
                + "FROM hotels WHERE hotel_id = ?";

        // DB_PASSWORD must be exported before the program runs.
        try (Connection conn = DriverManager.getConnection(URL, "root", System.getenv("DB_PASSWORD"));
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, 1);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    System.out.println("no hotel with id 1");
                    return;
                }

                dumpRow(rs);

                Integer stars = nullableStars(rs);
                System.out.println("stars as Integer: " + (stars == null ? "NULL" : stars));

                // A string column returns null directly, so check before using it.
                String description = rs.getString("description");
                System.out.println("description present: " + (description != null && !description.isBlank()));
            }
        }
    }
}
```

Three details carry the example. `getColumnLabel` differs from `getColumnName` when the query uses an alias, and the label is what the caller sees. `getObject` returns a boxed value, which is why the NULL test happens after the read and not before. `wasNull` is only meaningful for the getter you just called, so the primitive path keeps the getter and the check next to each other.

The `%s` format works because `getObject` already returned a Java object of the right class. A `DATETIME` column arrives as `java.sql.Timestamp`, a `DECIMAL` as `BigDecimal`. If you need a specific type, ask for it directly with `getObject(col, LocalDate.class)` instead of formatting whatever came back.

### Example 7: a CRUD cycle that trusts the returned counts

The insert asks for the generated key at prepare time, and every later call uses that id. Deleting twice returns false, which is the difference between an idempotent delete and an exception.

```java
// File: CrudWithKeys.java
// Data shape: hotel row -> generated int hotel_id -> later lookups by that id.
// Compile: javac CrudWithKeys.java

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;

public class CrudWithKeys {

    private static final String URL =
            "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";

    /** Inserts one hotel and returns the id the database assigned. */
    static int insert(Connection conn, String city, String name, String description,
                      int stars, String ownerEmail) throws SQLException {

        String sql = "INSERT INTO hotels (city, name, description, stars, owner_email) "
                + "VALUES (?, ?, ?, ?, ?)";

        // RETURN_GENERATED_KEYS is asked for at prepare time, not at execute time.
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, city);
            ps.setString(2, name);

            // A real NULL needs a SQL type, otherwise the driver cannot describe the parameter.
            if (description == null) {
                ps.setNull(3, Types.VARCHAR);
            } else {
                ps.setString(3, description);
            }

            ps.setInt(4, stars);
            ps.setString(5, ownerEmail);

            int rows = ps.executeUpdate();
            if (rows != 1) {
                throw new SQLException("insert affected " + rows + " rows");
            }

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (!keys.next()) {
                    throw new SQLException("insert returned no generated key");
                }
                return keys.getInt(1);
            }
        }
    }

    /** Updates one column and returns the affected row count, which is 0 for a missing id. */
    static int setStars(Connection conn, int hotelId, int stars) throws SQLException {
        String sql = "UPDATE hotels SET stars = ? WHERE hotel_id = ?";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, stars);
            ps.setInt(2, hotelId);
            return ps.executeUpdate();
        }
    }

    /** Deletes by primary key. A foreign key still pointing at the row makes this fail. */
    static boolean delete(Connection conn, int hotelId) throws SQLException {
        String sql = "DELETE FROM hotels WHERE hotel_id = ?";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, hotelId);
            return ps.executeUpdate() == 1;
        }
    }

    /** Reads one column of one row, or null when the id is gone. */
    static String name(Connection conn, int hotelId) throws SQLException {
        String sql = "SELECT name FROM hotels WHERE hotel_id = ?";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, hotelId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getString("name") : null;
            }
        }
    }

    public static void main(String[] args) throws SQLException {
        try (Connection conn = DriverManager.getConnection(URL, "root", System.getenv("DB_PASSWORD"))) {

            // 1. CREATE, id comes back from the database so nothing is guessed.
            int hotelId = insert(conn, "Budapest", "Hotel Sunrise", null, 4, "owner@example.com");
            System.out.println("created hotel_id " + hotelId);

            // 2. READ, using the key we just received.
            System.out.println("name: " + name(conn, hotelId));

            // 3. UPDATE, a count of 0 means the id is gone, not that the value was equal.
            int changed = setStars(conn, hotelId, 5);
            System.out.println("rows changed: " + changed);

            // 4. DELETE, and prove the row is really gone.
            System.out.println("deleted: " + delete(conn, hotelId));
            System.out.println("name after delete: " + name(conn, hotelId));

            // A second delete returns false instead of throwing.
            System.out.println("deleted again: " + delete(conn, hotelId));
        }
    }
}
```

One connection serves all five calls, which is right here because the program is single threaded and short lived. In a servlet or a Spring service the connection would come from a pool and every method would have to close it back, so the helper methods would take a `Connection` argument exactly as written rather than open their own.

Note the difference between a NULL `description` and an empty string. The insert binds `setNull(3, Types.VARCHAR)` for the former, and `setString(3, "")` for the latter. MySQL will store both, and a later `WHERE description IS NULL` finds only the first.

### Example 8: savepoints around a batch

A batch is a unit of network work, not a unit of database state. Wrapping it in a savepoint means a rejected batch does not undo the work that came before it in the same transaction.

```java
// File: SavepointBatch.java
// Data shape: List<BookingRow> -> int[] batch counts, with a named savepoint as the undo marker.
// Compile: javac SavepointBatch.java

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Savepoint;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.List;

public class SavepointBatch {

    private static final String URL =
            "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";

    /** One booking line as it arrives from a file or a form. */
    record BookingRow(String customerEmail, int hotelId, LocalDate startDate,
                      LocalDate endDate, int adults, int children) {
    }

    /**
     * Inserts the rows as one batch. A failure inside the batch undoes the batch only,
     * so work that the caller did before the savepoint survives.
     */
    static int insertBatch(Connection conn, List<BookingRow> rows) throws SQLException {
        String sql = "INSERT INTO bookings "
                + "(customer_email, hotel_id, start_date, end_date, adults, children) "
                + "VALUES (?, ?, ?, ?, ?, ?)";

        Savepoint beforeBatch = conn.setSavepoint("before_batch");

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            for (BookingRow row : rows) {
                ps.setString(1, row.customerEmail());
                ps.setInt(2, row.hotelId());
                ps.setDate(3, java.sql.Date.valueOf(row.startDate()));
                ps.setDate(4, java.sql.Date.valueOf(row.endDate()));
                ps.setInt(5, row.adults());
                ps.setInt(6, row.children());
                ps.addBatch();
            }

            int[] counts = ps.executeBatch();
            for (int count : counts) {
                // A failed element is reported, not thrown, unless you ask for stop-on-error.
                if (count == Statement.EXECUTE_FAILED) {
                    throw new SQLException("a batch element failed");
                }
            }

            // Success path: the savepoint is no longer needed.
            conn.releaseSavepoint(beforeBatch);
            return counts.length;
        } catch (SQLException e) {
            // Undo every row of the batch and keep the transaction open for the caller.
            conn.rollback(beforeBatch);
            throw e;
        }
    }

    public static void main(String[] args) throws SQLException {
        try (Connection conn = DriverManager.getConnection(URL, "root", System.getenv("DB_PASSWORD"))) {

            conn.setAutoCommit(false);

            try {
                // Step one that must survive: a parent hotel row.
                try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO hotels (city, name, description, stars, owner_email) "
                                + "VALUES (?, ?, ?, ?, ?)",
                        Statement.RETURN_GENERATED_KEYS)) {

                    ps.setString(1, "Vienna");
                    ps.setString(2, "Hotel Ring");
                    ps.setString(3, "Small hotel beside the ring road");
                    ps.setInt(4, 4);
                    ps.setString(5, "owner3@example.com");
                    ps.executeUpdate();
                }

                // Bad hotel id, the foreign key rejects the batch.
                try {
                    insertBatch(conn, List.of(
                            new BookingRow("anna.kovacs@example.com", 9999,
                                    LocalDate.of(2024, 7, 1), LocalDate.of(2024, 7, 3), 2, 0)));
                    System.out.println("batch accepted");
                } catch (SQLException e) {
                    // Only the batch was rolled back, the hotel row is still pending.
                    System.out.println("batch rejected: " + e.getMessage());
                }

                // A good batch after the failed one proves the transaction is still usable.
                int accepted = insertBatch(conn, List.of(
                        new BookingRow("john.smith@example.com", 1,
                                LocalDate.of(2024, 8, 1), LocalDate.of(2024, 8, 4), 1, 1)));
                System.out.println("batch rows: " + accepted);

                // One commit for the hotel and the good batch together.
                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } finally {
                // The connection leaves this method in the state it arrived in.
                conn.setAutoCommit(true);
            }
        }
    }
}
```

`releaseSavepoint` sits on the success path only. After `rollback(savepoint)` the driver may treat that savepoint as used up, and calling release on it can throw a second exception that hides the first. MySQL releases the savepoint itself during the rollback, so there is nothing left to clean.

The savepoint name is optional, `setSavepoint()` returns an unnamed one. Names help when a log line has to explain which marker was used, and they must be unique inside the transaction.

### Example 9: chunked batch upsert

A batch of fifty thousand rows is a memory problem on both sides and an expensive retry. Chunking keeps each round trip small and lets you report progress between chunks.

```java
// File: BatchUpsert.java
// Data shape: List<String[]> -> int[] per-statement counts, chunked so memory stays flat.
// Compile: javac BatchUpsert.java

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

public class BatchUpsert {

    private static final String URL =
            "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";

    private static final int CHUNK = 500;

    /**
     * MySQL upsert. The unique key on owner_email decides insert versus update.
     * ON DUPLICATE KEY is MySQL syntax, other vendors use ON CONFLICT or MERGE.
     */
    static int[] upsertHotels(Connection conn, List<String[]> rows) throws SQLException {
        String sql = "INSERT INTO hotels (city, name, description, stars, owner_email) "
                + "VALUES (?, ?, ?, ?, ?) "
                + "ON DUPLICATE KEY UPDATE name = VALUES(name), stars = VALUES(stars)";

        int[] lastCounts = new int[0];

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            int pending = 0;

            for (String[] row : rows) {
                ps.setString(1, row[0]);
                ps.setString(2, row[1]);
                ps.setString(3, row[2]);
                ps.setInt(4, Integer.parseInt(row[3]));
                ps.setString(5, row[4]);
                ps.addBatch();
                pending++;

                // Flush at a fixed size: each chunk is one round trip and one retry unit.
                if (pending == CHUNK) {
                    lastCounts = ps.executeBatch();
                    ps.clearBatch();
                    pending = 0;
                }
            }

            if (pending > 0) {
                lastCounts = ps.executeBatch();
            }
        }

        return lastCounts;
    }

    /** A count of -2 means the driver refuses to report rows, which is not a failure. */
    static String describe(int[] counts) {
        int known = 0;
        int unknown = 0;
        for (int count : counts) {
            if (count == Statement.SUCCESS_NO_INFO) {
                unknown++;
            } else if (count >= 0) {
                known += count;
            }
        }
        return known + " rows changed, " + unknown + " statements without a count";
    }

    public static void main(String[] args) throws SQLException {
        List<String[]> rows = List.of(
                new String[]{"Budapest", "Hotel Sunrise", "Quiet hotel near the river", "4", "owner@example.com"},
                new String[]{"Vienna", "Hotel Ring", "Small hotel beside the ring road", "4", "owner3@example.com"},
                new String[]{"Prague", "Hotel Bridge", "View of the old bridge", "5", "owner4@example.com"});

        try (Connection conn = DriverManager.getConnection(URL, "root", System.getenv("DB_PASSWORD"))) {
            boolean originalAutoCommit = conn.getAutoCommit();
            conn.setAutoCommit(false);

            try {
                int[] counts = upsertHotels(conn, rows);
                conn.commit();
                System.out.println(describe(counts));
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(originalAutoCommit);
            }
        }
    }
}
```

The upsert needs a unique index to have anything to conflict on. In the sample schema from Example 5, add one before running this code:

```sql
ALTER TABLE hotels ADD UNIQUE KEY uq_owner (owner_email);
```

`clearBatch` after each flush matters. Without it the driver keeps every parameter set until the next execute, so the memory saving is gone. `VALUES(col)` inside `ON DUPLICATE KEY UPDATE` refers to the value the insert tried to write, which is why the same parameter set can serve both branches.

Two rows in one batch with the same `owner_email` will hit each other inside the same statement. MySQL applies the update twice; a vendor with `ON CONFLICT DO NOTHING` may reject the whole statement instead. Deduplicate the input if that matters.

### Example 10: asking the database what it can do

Metadata is the difference between code that works on one driver and code that refuses cleanly on another. `DatabaseMetaData` describes the server, `ResultSetMetaData` describes one row shape.

```java
// File: MetadataReport.java
// Data shape: DatabaseMetaData -> one line per capability; ResultSetMetaData -> one line per column.
// Compile: javac MetadataReport.java

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public class MetadataReport {

    private static final String URL =
            "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";

    /** Connection level facts: what the server is, and what the driver claims it can do. */
    static void printDatabase(Connection conn) throws SQLException {
        DatabaseMetaData meta = conn.getMetaData();

        System.out.println("product: " + meta.getDatabaseProductName()
                + " " + meta.getDatabaseProductVersion());
        System.out.println("driver: " + meta.getDriverName()
                + " " + meta.getDriverVersion());
        System.out.println("url: " + meta.getURL());
        System.out.println("user: " + meta.getUserName());

        // Capability flags are cheap to check and avoid writing code the driver cannot run.
        System.out.println("transactions: " + meta.supportsTransactions()
                + ", savepoints: " + meta.supportsSavepoints()
                + ", batch: " + meta.supportsBatchUpdates());

        System.out.println("isolation: " + conn.getTransactionIsolation());

        // isValid answers within the timeout instead of throwing on a dead socket.
        System.out.println("connection valid: " + conn.isValid(2));
    }

    /** Lists the tables of the current schema, skipping views and system tables. */
    static void printTables(Connection conn) throws SQLException {
        DatabaseMetaData meta = conn.getMetaData();

        // The catalog is the schema name in MySQL and null in SQLite.
        try (ResultSet tables = meta.getTables(conn.getCatalog(), null, "%",
                new String[]{"TABLE"})) {

            while (tables.next()) {
                System.out.println("table: " + tables.getString("TABLE_NAME"));
            }
        }
    }

    /** Describes the columns of one known table without running a query on it. */
    static void printColumns(Connection conn, String table) throws SQLException {
        DatabaseMetaData meta = conn.getMetaData();

        try (ResultSet columns = meta.getColumns(conn.getCatalog(), null, table, "%")) {
            while (columns.next()) {
                System.out.printf("%-14s %-10s nullable=%s size=%d%n",
                        columns.getString("COLUMN_NAME"),
                        columns.getString("TYPE_NAME"),
                        columns.getString("IS_NULLABLE"),
                        columns.getInt("COLUMN_SIZE"));
            }
        }
    }

    /** Describes a result set, which is how a generic row printer learns its columns. */
    static void printResultColumns(Connection conn) throws SQLException {
        String sql = "SELECT hotel_id, name, stars, description FROM hotels WHERE city = ?";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, "Budapest");

            try (ResultSet rs = ps.executeQuery()) {
                ResultSetMetaData meta = rs.getMetaData();

                for (int col = 1; col <= meta.getColumnCount(); col++) {
                    System.out.printf("%d %-14s %-10s nulls=%d%n",
                            col,
                            meta.getColumnLabel(col),
                            meta.getColumnTypeName(col),
                            meta.isNullable(col));
                }
            }
        }
    }

    public static void main(String[] args) throws SQLException {
        try (Connection conn = DriverManager.getConnection(URL, "root", System.getenv("DB_PASSWORD"))) {
            printDatabase(conn);
            printTables(conn);
            printColumns(conn, "hotels");
            printResultColumns(conn);
        }
    }
}
```

`getTables` and `getColumns` return ordinary result sets, so they close like any other cursor. The second argument is `null` for the schema, which means "do not filter by schema"; in MySQL the catalog is the database name, so `conn.getCatalog()` is the value you want. Passing `"%_%"` as the table pattern excludes nothing and is a common way to ask for every table.

Case sensitivity is a trap. `getTables` compares patterns in the server's own collation, and MySQL on Linux is case sensitive for table names while Windows is not. A hard-coded `"Hotels"` works on one machine and returns zero rows on another. Store names in lower case and keep them that way.

### Example 11: a repository that builds its own WHERE clause

Optional filters are where concatenation creeps back in. The safe pattern puts a fixed SQL fragment and a matching parameter into the same branch, so the order of placeholders and the order of bindings cannot drift apart.

```java
// File: HotelSearchRepository.java
// Data shape: Search(city, minStars, orderBy) -> List<Hotel>; text block SQL with bound filters.
// Compile: javac HotelSearchRepository.java

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Read side of a small hotel catalogue.
 *
 * Sample schema the queries assume:
 *
 *   CREATE TABLE hotels (
 *       hotel_id INT PRIMARY KEY AUTO_INCREMENT,
 *       city VARCHAR(80) NOT NULL,
 *       name VARCHAR(120) NOT NULL,
 *       description TEXT,
 *       stars INT NOT NULL,
 *       owner_email VARCHAR(120) NOT NULL,
 *       UNIQUE KEY uq_owner (owner_email)
 *   );
 */
public class HotelSearchRepository {

    private static final String URL =
            "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = System.getenv("DB_PASSWORD");

    /** One row, already detached from the connection. */
    record Hotel(int hotelId, String city, String name, int stars,
                 String description, String ownerEmail) {
    }

    /** Optional filters, where null means "do not filter on this". */
    record Search(String city, Integer minStars, String orderBy) {
    }

    private Connection connect() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    /** ORDER BY cannot be bound, so the request value maps to a fixed fragment. */
    private static String orderClause(String requested) {
        return switch (requested == null ? "" : requested) {
            case "stars" -> "stars DESC, name";
            case "name" -> "name";
            default -> "hotel_id";
        };
    }

    /** Builds the WHERE list from the filters that are present, then binds in the same order. */
    List<Hotel> search(Search search) throws SQLException {
        StringBuilder sql = new StringBuilder("""
                SELECT hotel_id, city, name, stars, description, owner_email
                FROM hotels
                WHERE 1 = 1
                """);
        List<Object> params = new ArrayList<>();

        if (search.city() != null) {
            sql.append(" AND city = ?");
            params.add(search.city());
        }
        if (search.minStars() != null) {
            sql.append(" AND stars >= ?");
            params.add(search.minStars());
        }

        sql.append(" ORDER BY ").append(orderClause(search.orderBy()));

        List<Hotel> hotels = new ArrayList<>();
        try (Connection conn = connect();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            // setObject picks the setter from the runtime class, so the list stays untyped.
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    hotels.add(map(rs));
                }
            }
        }
        return hotels;
    }

    /** Reads one hotel by primary key. Empty means the row does not exist. */
    Optional<Hotel> findById(int hotelId) throws SQLException {
        String sql = "SELECT hotel_id, city, name, stars, description, owner_email "
                + "FROM hotels WHERE hotel_id = ?";

        try (Connection conn = connect();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, hotelId);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    /** One line per city with its best rated hotel. A tie returns both hotels. */
    List<String> bestPerCity() throws SQLException {
        String sql = """
                SELECT h.city,
                       h.name,
                       h.stars,
                       (SELECT COUNT(*) FROM bookings b WHERE b.hotel_id = h.hotel_id) AS booking_count
                FROM hotels h
                WHERE h.stars = (SELECT MAX(h2.stars) FROM hotels h2 WHERE h2.city = h.city)
                ORDER BY h.city, h.name
                """;

        List<String> lines = new ArrayList<>();
        try (Connection conn = connect();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                lines.add(rs.getString("city") + ": " + rs.getString("name")
                        + " (" + rs.getInt("stars") + " stars, "
                        + rs.getInt("booking_count") + " bookings)");
            }
        }
        return lines;
    }

    /** One place that knows how a result row becomes an object. */
    private static Hotel map(ResultSet rs) throws SQLException {
        return new Hotel(
                rs.getInt("hotel_id"),
                rs.getString("city"),
                rs.getString("name"),
                rs.getInt("stars"),          // NOT NULL in the schema, so no wasNull check
                rs.getString("description"), // nullable, stays null in the record
                rs.getString("owner_email"));
    }

    public static void main(String[] args) throws SQLException {
        HotelSearchRepository repository = new HotelSearchRepository();

        System.out.println("Budapest, 4 stars or better, best first:");
        for (Hotel hotel : repository.search(new Search("Budapest", 4, "stars"))) {
            System.out.println("  " + hotel.hotelId() + " " + hotel.name());
        }

        System.out.println("all hotels by name:");
        for (Hotel hotel : repository.search(new Search(null, null, "name"))) {
            System.out.println("  " + hotel.name() + " in " + hotel.city());
        }

        repository.findById(1).ifPresentOrElse(
                hotel -> System.out.println("id 1 is " + hotel.name()),
                () -> System.out.println("id 1 is missing"));

        System.out.println("best hotel per city:");
        for (String line : repository.bestPerCity()) {
            System.out.println("  " + line);
        }
    }
}
```

`WHERE 1 = 1` looks like a trick until you remove it. Without it, every optional branch has to know whether it is the first condition, and the code grows a boolean or a string strip. With it, every branch appends `AND ...` and the parameter list stays in step with the text.

`setObject` is convenient and slightly loose. It asks the driver to infer the SQL type from the Java class, so `Integer` becomes `INTEGER` and `String` becomes `VARCHAR`. That inference is fine for these two types. For a `LocalDate`, a `BigDecimal`, or a value that has to match a `DATE` column exactly, bind with the specific setter or pass the target type: `ps.setObject(i + 1, value, Types.DATE)`.

The sort whitelist is the part exam graders look for. `orderClause` never returns anything the caller sent. It returns one of three constants, and an unknown value falls through to the primary key. The same rule applies to a column list in a report builder.

## Common mistakes

- Concatenating user input into SQL. Use `?` and bind.
- Closing only the `Connection` and leaving statements and result sets to the garbage collector. Close in reverse order, ideally with try-with-resources.
- Reusing one `Connection` as a static field across threads. Connections are not thread safe.
- Comparing `getInt` with 0 without checking `wasNull()`, so a NULL looks like a real zero.
- Forgetting that parameter indexes start at 1 and then binding index 0.
- Using `executeQuery` for `INSERT`, or `executeUpdate` for `SELECT`.
- Ignoring the int returned by `executeUpdate`, so an update that matched no row looks successful.
- Leaving autoCommit on and expecting rollback to undo earlier statements.
- Forgetting `conn.rollback()` in the catch block, especially with pooled connections.
- Running DDL in the middle of a transaction in MySQL and losing the rollback.
- Reading a password from a hard-coded string and committing it. Use a config file or an environment variable, and never paste a real credential into an exam answer.
- Printing `e.getMessage()` only. Log `getSQLState()` and `getErrorCode()` too, and keep the exception as the cause when you translate it.
- Assuming a batch element count is always 1. Check for `SUCCESS_NO_INFO`.

## Exam checklist

- Can you write the four step sequence `getConnection`, `prepareStatement`, `setX`, `executeQuery` from memory, with try-with-resources around all three resources?
- Can you explain why `Class.forName` is usually unnecessary with a modern driver?
- Can you name the parts of a JDBC URL and put the credentials in the right method?
- Can you convert a concatenated query into a prepared one and explain what the placeholder protects?
- Can you read a nullable int column correctly with `wasNull()`?
- Can you insert a row, read its generated key, update one column, and delete by id?
- Can you wrap two statements in a transaction with commit and rollback, and restore autoCommit?
- Can you explain what a savepoint buys you over a full rollback?
- Can you batch a list of rows and say what `executeBatch` returns?
- Can you name two limits of placeholders, such as table names and sort direction?
- Can you translate `SQLException` into a domain exception without losing the cause?
- Can you explain why a connection pool changes how you close a connection and reset autoCommit?

