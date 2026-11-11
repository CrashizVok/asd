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

