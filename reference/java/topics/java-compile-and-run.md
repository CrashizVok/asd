# Compile and run

Java topic · Exam Wiki

```bash
javac BookingsCli.java
java BookingsCli bookings.csv
```

If the program uses a database driver, add the jar to the classpath:

```bash
java -cp .:mysql-connector-j-8.4.0.jar BookingsCli
```

On Windows the separator is `;` instead of `:`.
