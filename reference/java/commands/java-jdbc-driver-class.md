# Driver class and jar

Java command · JDBC

The driver jar must be on the classpath. Modern JDBC loads it through ServiceLoader, so Class.forName is usually unnecessary.

## Syntax

```java
Class.forName("com.mysql.cj.jdbc.Driver")
```

## Example

```java
// Compile and run with the driver jar on the classpath.
// javac -cp mysql-connector-j-8.4.0.jar App.java
// java -cp .:mysql-connector-j-8.4.0.jar App

import java.sql.Connection;
import java.sql.DriverManager;

public class App {
    public static void main(String[] args) throws Exception {
        // Only needed for old drivers or custom class loaders.
        Class.forName("com.mysql.cj.jdbc.Driver");

        String url = "jdbc:mysql://localhost:3306/bookings?serverTimezone=UTC";
        try (Connection conn = DriverManager.getConnection(url, "root", "password")) {
            System.out.println("driver loaded, connection open");
        }
    }
}

// SQLite needs org.sqlite.JDBC and a URL such as jdbc:sqlite:bookings.db.
```

## Details

No suitable driver found is a classpath problem, not a SQL problem. Check the jar name, the classpath separator, and the URL prefix in that order.

The JDBC 4 service file inside the jar names the driver class, which is why explicit loading is not required in normal applications.
