import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * BookingsCli is a complete console template for the exam task.
 *
 * Run:
 *   javac BookingsCli.java
 *   java BookingsCli bookings.csv
 *
 * The CSV may have a header. The code detects the header by looking for
 * "customer_email" in the first line. Column order does not matter when the
 * header is present. Empty fields are treated as empty strings or zero.
 *
 * The output labels are Hungarian because the exam sheet asks for that
 * format. Change the labels if your task sheet uses different ones.
 */
public class BookingsCli {

    /**
     * One row of the CSV. Keep the field names aligned with the CSV header.
     * The record gives getters, equals, hashCode, and toString for free.
     */
    public record Booking(
            String customerEmail,
            String firstName,
            String lastName,
            String phone,
            String birthday,
            String customerImage,
            int hotelId,
            String hotelCity,
            String hotelName,
            String hotelDescription,
            int hotelStars,
            String hotelOwnerEmail,
            String hotelImage,
            LocalDate startDate,
            LocalDate endDate,
            int adults,
            int children,
            int boylovers
    ) {
        /** Number of nights between the two dates. */
        public long nights() {
            return ChronoUnit.DAYS.between(startDate, endDate);
        }

        /** Full guest name with a single space. */
        public String guestName() {
            return (firstName + " " + lastName).trim();
        }

        /** Hotel name with the city in parentheses. */
        public String hotelLabel() {
            return hotelName + " (" + hotelCity + ")";
        }
    }

    /** Used when the CSV has no header. Order must match the file. */
    private static final List<String> DEFAULT_HEADER = List.of(
            "customer_email", "first_name", "last_name", "phone", "birthday",
            "customer_image", "hotel_id", "hotel_city", "hotel_name",
            "hotel_description", "hotel_stars", "hotel_owner_email",
            "hotel_image", "start_date", "end_date", "adults", "children",
            "boylovers"
    );

    public static void main(String[] args) throws Exception {
        Path csvPath = Path.of(args.length > 0 ? args[0] : "bookings.csv");
        if (!Files.exists(csvPath)) {
            System.err.println("File not found: " + csvPath.toAbsolutePath());
            return;
        }

        List<Booking> bookings = readBookings(csvPath);

        System.out.println("Foglalások feldolgozása...");
        System.out.println("=========================");

        // Task 1: count the rows.
        System.out.println("1. Beolvasott foglalások száma: " + bookings.size());

        // Task 2: the longest booking by nights.
        System.out.println("\n2. Leghosszabb foglalás adatai:");
        bookings.stream()
                .max(Comparator.comparingLong(Booking::nights))
                .ifPresent(b -> {
                    System.out.println("Vendég: " + b.guestName());
                    System.out.println("Szálloda: " + b.hotelLabel());
                    System.out.printf("Időszak: %s - %s (%d nap)%n",
                            b.startDate(), b.endDate(), b.nights());
                });

        // Task 3: bookings that start in 2024, longest first.
        System.out.println("\n3. 2024-es foglalások hossz szerint csökkenő sorrendben:");
        bookings.stream()
                .filter(b -> b.startDate().getYear() == 2024)
                .sorted(Comparator.comparingLong(Booking::nights).reversed())
                .forEach(b -> System.out.printf("%s - %s (%d nap)%n",
                        b.guestName(), b.hotelName(), b.nights()));

        // Task 4: count unique guests, pick one at random, print their bookings.
        System.out.println("\n4. Véletlenszerű vendég foglalásai:");
        List<String> guestEmails = bookings.stream()
                .map(Booking::customerEmail)
                .filter(email -> !email.isBlank())
                .distinct()
                .sorted()
                .toList();
        System.out.println("Összes egyedi vendég száma: " + guestEmails.size());
        if (!guestEmails.isEmpty()) {
            String picked = guestEmails.get(new Random().nextInt(guestEmails.size()));
            System.out.println("Véletlenszerű vendég: " + picked);
            System.out.println("Foglalásai:");
            bookings.stream()
                    .filter(b -> b.customerEmail().equals(picked))
                    .sorted(Comparator.comparing(Booking::startDate))
                    .forEach(b -> System.out.printf("  - %s (%s)%n",
                            b.hotelLabel(), b.startDate()));
        }

        // Task 5: the hotel description with the most words.
        // A hotel can appear in many rows, so collect one description per name.
        System.out.println("\n5. Legtöbb szóból álló hotel leírás:");
        Map<String, String> descriptions = bookings.stream()
                .collect(Collectors.toMap(
                        Booking::hotelName,
                        b -> b.hotelDescription() == null ? "" : b.hotelDescription(),
                        (first, second) -> first,
                        TreeMap::new
                ));
        descriptions.entrySet().stream()
                .max(Comparator.comparingInt(e -> wordCount(e.getValue())))
                .ifPresent(entry -> {
                    int words = wordCount(entry.getValue());
                    System.out.println("Szálloda: " + entry.getKey());
                    System.out.println("Leírás: " + entry.getValue());
                    System.out.println("Szavak száma: " + words);
                });

        // Task 6: bookings per year, ascending, comma separated, no trailing comma.
        System.out.println("\n6. Éves bontásban a foglalások száma:");
        Map<Integer, Long> byYear = bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.startDate().getYear(),
                        TreeMap::new,
                        Collectors.counting()
                ));
        String yearLine = byYear.entrySet().stream()
                .map(e -> e.getKey() + ": " + e.getValue())
                .collect(Collectors.joining(", "));
        System.out.println(yearLine);

        // Task 7: write bookings of at most one night to a text file.
        System.out.println("\n7. Rövid foglalások mentése rovidek.txt fájlba:");
        List<Booking> shortBookings = bookings.stream()
                .filter(b -> b.nights() <= 1)
                .toList();
        List<String> outputLines = new ArrayList<>();
        outputLines.add("vendeg;szalloda;kezdet;veg;ejszakak");
        shortBookings.forEach(b -> outputLines.add(String.join(";",
                b.guestName(),
                b.hotelName(),
                b.startDate().toString(),
                b.endDate().toString(),
                String.valueOf(b.nights())
        )));
        Files.write(Path.of("rovidek.txt"), outputLines, StandardCharsets.UTF_8);
        System.out.println("Mentve " + shortBookings.size() + " rövid foglalás.");

        System.out.println("\nProgram vége.");
    }

    /**
     * Read the CSV and convert each valid line to a Booking.
     * Bad lines are skipped with a message on stderr, so one broken row does
     * not stop the whole program.
     */
    public static List<Booking> readBookings(Path path) throws IOException {
        List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
        if (lines.isEmpty()) {
            return List.of();
        }

        // Remove the UTF-8 byte order mark if the file starts with one.
        if (lines.get(0).startsWith("\uFEFF")) {
            lines.set(0, lines.get(0).substring(1));
        }

        List<String> possibleHeader = parseCsvLine(lines.get(0));
        boolean hasHeader = possibleHeader.contains("customer_email");
        List<String> columnNames = hasHeader ? possibleHeader : DEFAULT_HEADER;

        Map<String, Integer> index = new HashMap<>();
        for (int i = 0; i < columnNames.size(); i++) {
            index.put(columnNames.get(i).trim(), i);
        }

        List<Booking> result = new ArrayList<>();
        int firstDataLine = hasHeader ? 1 : 0;
        for (int i = firstDataLine; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line.isBlank()) {
                continue;
            }
            try {
                List<String> row = parseCsvLine(line);
                result.add(new Booking(
                        get(row, index, "customer_email"),
                        get(row, index, "first_name"),
                        get(row, index, "last_name"),
                        get(row, index, "phone"),
                        get(row, index, "birthday"),
                        get(row, index, "customer_image"),
                        intValue(get(row, index, "hotel_id"), 0),
                        get(row, index, "hotel_city"),
                        get(row, index, "hotel_name"),
                        get(row, index, "hotel_description"),
                        intValue(get(row, index, "hotel_stars"), 0),
                        get(row, index, "hotel_owner_email"),
                        get(row, index, "hotel_image"),
                        date(get(row, index, "start_date")),
                        date(get(row, index, "end_date")),
                        intValue(get(row, index, "adults"), 0),
                        intValue(get(row, index, "children"), 0),
                        intValue(get(row, index, "boylovers"), 0)
                ));
            } catch (RuntimeException ex) {
                System.err.println("Skipping line " + (i + 1) + ": " + ex.getMessage());
            }
        }
        return result;
    }

    /**
     * Split one CSV line. Handles commas inside double quotes and doubled
     * quotes inside a quoted field. This covers the exam files.
     */
    public static List<String> parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    current.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                fields.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        fields.add(current.toString());
        return fields;
    }

    /** Read a column by header name. Missing columns return an empty string. */
    public static String get(List<String> row, Map<String, Integer> index, String name) {
        Integer position = index.get(name);
        if (position == null || position >= row.size()) {
            return "";
        }
        return row.get(position).trim();
    }

    /** Parse a whole number, return the fallback for empty or bad input. */
    public static int intValue(String value, int fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    /** Parse an ISO date. Also accepts a date and time by taking the first 10 chars. */
    public static LocalDate date(String value) {
        String text = value.trim();
        if (text.length() > 10) {
            text = text.substring(0, 10);
        }
        return LocalDate.parse(text);
    }

    /** Count words separated by whitespace. Empty text has zero words. */
    public static int wordCount(String text) {
        if (text == null || text.isBlank()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }
}
