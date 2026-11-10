(function () {
    const lang = 'Java';

    const entries = [
        {
            id: 'java-main',
            group: 'Basics',
            name: 'main method',
            syntax: 'public static void main(String[] args) {}',
            desc: 'The entry point of a console program. The JVM calls it with the command-line arguments.',
            example: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}'
        },
        {
            id: 'java-print',
            group: 'Basics',
            name: 'System.out.println',
            syntax: 'System.out.println(value);',
            desc: 'Prints a value and moves to a new line. print does not move to a new line; printf formats.',
            example: 'System.out.println("Hello");\nSystem.out.print("No newline");\nSystem.out.printf("%s is %d years old%n", "Anna", 22);'
        },
        {
            id: 'java-scanner',
            group: 'Basics',
            name: 'Scanner',
            syntax: 'Scanner sc = new Scanner(System.in);',
            desc: 'Reads console input. nextLine reads a whole line; nextInt reads an integer. Close it when done.',
            example: 'import java.util.Scanner;\n\nScanner sc = new Scanner(System.in);\nSystem.out.print("Name: ");\nString name = sc.nextLine();\nSystem.out.print("Age: ");\nint age = sc.nextInt();\nsc.close();'
        },
        {
            id: 'java-variables',
            group: 'Basics',
            name: 'variables and types',
            syntax: 'int count = 3;\ndouble price = 12.5;\nboolean ok = true;',
            desc: 'Java is statically typed. Common primitives: int, long, double, boolean, char. String is a class.',
            example: 'int adults = 2;\ndouble price = 89.90;\nboolean paid = false;\nchar grade = \'A\';\nString city = "Budapest";\n\nSystem.out.println(adults + " adults");'
        },
        {
            id: 'java-var',
            group: 'Basics',
            name: 'var',
            syntax: 'var name = "Anna";',
            desc: 'Local type inference. The compiler still knows the type; it is not dynamic typing. Use it when the type is obvious.',
            example: 'var city = "Budapest";\nvar nights = 3;\nvar total = nights * 80;\n\nSystem.out.println(city + ": " + total);'
        },
        {
            id: 'java-casting',
            group: 'Basics',
            name: 'casting',
            syntax: '(int) value',
            desc: 'Converts between types. Narrowing a double to int cuts the decimals. Parsing a string uses Integer.parseInt.',
            example: 'double price = 12.99;\nint whole = (int) price; // 12\n\nString text = "42";\nint number = Integer.parseInt(text);\ndouble value = Double.parseDouble("3.5");'
        },
        {
            id: 'java-operators',
            group: 'Basics',
            name: 'operators',
            syntax: '+ - * / % == != > < && || !',
            desc: 'Arithmetic, comparison, and logic. Integer division drops the remainder. Use == for primitives and equals for strings and objects.',
            example: 'int a = 7;\nint b = 2;\n\nSystem.out.println(a / b); // 3\nSystem.out.println(a % b); // 1\nSystem.out.println(a > b && b > 0); // true\n\nString x = "hi";\nSystem.out.println(x.equals("hi")); // true'
        },
        {
            id: 'java-if',
            group: 'Control flow',
            name: 'if, else if, else',
            syntax: 'if (condition) { ... } else { ... }',
            desc: 'Runs a block when a condition is true. Conditions must be boolean, not numbers.',
            example: 'int stars = 4;\n\nif (stars >= 5) {\n    System.out.println("Luxury");\n} else if (stars >= 3) {\n    System.out.println("Comfortable");\n} else {\n    System.out.println("Basic");\n}'
        },
        {
            id: 'java-switch',
            group: 'Control flow',
            name: 'switch',
            syntax: 'switch (value) { case 1: ... break; default: ... }',
            desc: 'Chooses a branch by value. Do not forget break in the classic form. The arrow form has no fall-through.',
            example: 'int stars = 4;\n\nswitch (stars) {\n    case 5:\n        System.out.println("Luxury");\n        break;\n    case 4:\n        System.out.println("Great");\n        break;\n    default:\n        System.out.println("Standard");\n}'
        },
        {
            id: 'java-for',
            group: 'Control flow',
            name: 'for loop',
            syntax: 'for (int i = 0; i < n; i++) { ... }',
            desc: 'Runs a block with a counter. Use it when you need the index.',
            example: 'for (int i = 1; i <= 3; i++) {\n    System.out.println("Room " + i);\n}'
        },
        {
            id: 'java-for-each',
            group: 'Control flow',
            name: 'for-each loop',
            syntax: 'for (Type item : collection) { ... }',
            desc: 'Visits every element of an array or Iterable. It does not give the index.',
            example: 'String[] guests = {"Anna", "Ben", "Cara"};\n\nfor (String guest : guests) {\n    System.out.println(guest);\n}'
        },
        {
            id: 'java-while',
            group: 'Control flow',
            name: 'while and do-while',
            syntax: 'while (condition) { ... }\ndo { ... } while (condition);',
            desc: 'while checks before each run. do-while runs at least once.',
            example: 'int tries = 0;\nwhile (tries < 3) {\n    tries++;\n}\n\nint n;\ndo {\n    n = 1;\n} while (n < 0);'
        },
        {
            id: 'java-string',
            group: 'Strings',
            name: 'String',
            syntax: 'String name = "Anna";',
            desc: 'Strings are immutable objects. Use equals to compare content, not ==.',
            example: 'String first = "Anna";\nString last = "Kovacs";\nString full = first + " " + last;\n\nSystem.out.println(full.length());\nSystem.out.println(full.toUpperCase());\nSystem.out.println(full.equals("Anna Kovacs"));'
        },
        {
            id: 'java-string-methods',
            group: 'Strings',
            name: 'String methods',
            syntax: 'text.length()\ntext.substring(a, b)\ntext.indexOf("x")',
            desc: 'Common methods: length, charAt, substring, indexOf, contains, startsWith, endsWith, replace, split, trim.',
            example: 'String email = "anna@example.com";\n\nSystem.out.println(email.contains("@"));\nSystem.out.println(email.indexOf("@"));\nSystem.out.println(email.substring(0, 4));\nSystem.out.println(email.replace(".com", ".hu"));\nSystem.out.println(email.split("@")[0]);'
        },
        {
            id: 'java-stringbuilder',
            group: 'Strings',
            name: 'StringBuilder',
            syntax: 'new StringBuilder().append("a").append("b")',
            desc: 'Builds a string efficiently in a loop. String concatenation in a loop creates many objects.',
            example: 'StringBuilder sb = new StringBuilder();\nfor (int i = 1; i <= 3; i++) {\n    sb.append(i).append(" ");\n}\nSystem.out.println(sb.toString().trim()); // 1 2 3'
        },
        {
            id: 'java-string-format',
            group: 'Strings',
            name: 'String.format',
            syntax: 'String.format("%s: %d", name, count)',
            desc: 'Builds a formatted string. %s string, %d integer, %.2f two decimals, %n newline.',
            example: 'String name = "Anna";\nint nights = 3;\ndouble price = 89.9;\n\nString text = String.format("%s: %d nights, %.2f EUR", name, nights, price);\nSystem.out.println(text);'
        },
        {
            id: 'java-math',
            group: 'Numbers',
            name: 'Math',
            syntax: 'Math.max(a, b)\nMath.round(x)',
            desc: 'Math has static helpers: max, min, abs, round, floor, ceil, pow, sqrt, random.',
            example: 'System.out.println(Math.max(3, 9)); // 9\nSystem.out.println(Math.abs(-4));   // 4\nSystem.out.println(Math.round(4.6)); // 5\nSystem.out.println(Math.pow(2, 8)); // 256.0'
        },
        {
            id: 'java-random',
            group: 'Numbers',
            name: 'Random',
            syntax: 'Random random = new Random();\nrandom.nextInt(6) + 1',
            desc: 'Generates random values. nextInt(bound) returns 0 to bound - 1.',
            example: 'import java.util.Random;\n\nRandom random = new Random();\nint dice = random.nextInt(6) + 1;\nint index = random.nextInt(10);'
        },
        {
            id: 'java-array',
            group: 'Arrays',
            name: 'array',
            syntax: 'int[] numbers = {1, 2, 3};',
            desc: 'A fixed-size sequence. length is a field, not a method. Indexes start at 0.',
            example: 'int[] numbers = {4, 8, 15};\nString[] names = new String[3];\nnames[0] = "Anna";\n\nSystem.out.println(numbers.length);\nSystem.out.println(numbers[0]);\nfor (int n : numbers) System.out.println(n);'
        },
        {
            id: 'java-arrays',
            group: 'Arrays',
            name: 'Arrays utility',
            syntax: 'Arrays.sort(array)\nArrays.toString(array)',
            desc: 'Helpers for arrays: sort, toString, copyOf, fill, equals, stream.',
            example: 'import java.util.Arrays;\n\nint[] numbers = {4, 1, 3};\nArrays.sort(numbers);\nSystem.out.println(Arrays.toString(numbers)); // [1, 3, 4]\nint[] copy = Arrays.copyOf(numbers, 5);'
        },
        {
            id: 'java-arraylist',
            group: 'Collections',
            name: 'ArrayList',
            syntax: 'new ArrayList<String>()',
            desc: 'A resizable list. add, get, set, remove, size, contains, and clear are the common methods.',
            example: 'import java.util.ArrayList;\n\nArrayList<String> guests = new ArrayList<>();\nguests.add("Anna");\nguests.add("Ben");\n\nSystem.out.println(guests.get(0));\nSystem.out.println(guests.size());\nguests.remove("Ben");\nfor (String guest : guests) System.out.println(guest);'
        },
        {
            id: 'java-linkedlist',
            group: 'Collections',
            name: 'LinkedList',
            syntax: 'new LinkedList<String>()',
            desc: 'A list with fast add/remove at the ends. It can also act as a queue or deque.',
            example: 'import java.util.LinkedList;\n\nLinkedList<String> queue = new LinkedList<>();\nqueue.add("Anna");\nqueue.add("Ben");\n\nSystem.out.println(queue.removeFirst()); // Anna\nqueue.addLast("Cara");'
        },
        {
            id: 'java-hashmap',
            group: 'Collections',
            name: 'HashMap',
            syntax: 'new HashMap<String, Integer>()',
            desc: 'Stores key/value pairs with fast lookup. Keys are unique. put replaces an existing value.',
            example: 'import java.util.HashMap;\n\nHashMap<String, Integer> counts = new HashMap<>();\ncounts.put("Anna", 2);\ncounts.put("Ben", 1);\ncounts.put("Anna", counts.get("Anna") + 1);\n\nSystem.out.println(counts.get("Anna")); // 3\nSystem.out.println(counts.containsKey("Cara")); // false\nfor (var entry : counts.entrySet()) {\n    System.out.println(entry.getKey() + ": " + entry.getValue());\n}'
        },
        {
            id: 'java-treemap',
            group: 'Collections',
            name: 'TreeMap',
            syntax: 'new TreeMap<String, Integer>()',
            desc: 'A map sorted by key. Useful when output must be alphabetical or numeric order.',
            example: 'import java.util.TreeMap;\n\nTreeMap<String, Integer> counts = new TreeMap<>();\ncounts.put("Cara", 1);\ncounts.put("Anna", 2);\n\nfor (var entry : counts.entrySet()) {\n    System.out.println(entry.getKey()); // Anna, Cara\n}'
        },
        {
            id: 'java-hashset',
            group: 'Collections',
            name: 'HashSet',
            syntax: 'new HashSet<String>()',
            desc: 'A set of unique values with fast contains. It does not keep order.',
            example: 'import java.util.HashSet;\n\nHashSet<String> guests = new HashSet<>();\nguests.add("Anna");\nguests.add("Anna");\nguests.add("Ben");\n\nSystem.out.println(guests.size()); // 2\nSystem.out.println(guests.contains("Ben")); // true'
        },
        {
            id: 'java-treeset',
            group: 'Collections',
            name: 'TreeSet',
            syntax: 'new TreeSet<String>()',
            desc: 'A set that keeps values sorted and unique.',
            example: 'import java.util.TreeSet;\n\nTreeSet<String> names = new TreeSet<>();\nnames.add("Cara");\nnames.add("Anna");\nnames.add("Ben");\n\nSystem.out.println(names); // [Anna, Ben, Cara]'
        },
        {
            id: 'java-list-map-set',
            group: 'Collections',
            name: 'List, Map, Set interfaces',
            syntax: 'List<String> list = new ArrayList<>();',
            desc: 'Declare the interface and create a concrete implementation. It makes the code easier to change later.',
            example: 'import java.util.*;\n\nList<String> list = new ArrayList<>();\nMap<String, Integer> map = new HashMap<>();\nSet<String> set = new HashSet<>();\n\nlist.add("Anna");\nmap.put("Anna", 2);\nset.add("Anna");'
        },
        {
            id: 'java-iterator',
            group: 'Collections',
            name: 'Iterator',
            syntax: 'Iterator<String> it = list.iterator();',
            desc: 'Walks a collection. Use it.remove() to remove during iteration; removing from the list directly causes ConcurrentModificationException.',
            example: 'import java.util.*;\n\nList<String> list = new ArrayList<>(List.of("Anna", "Ben"));\nIterator<String> it = list.iterator();\n\nwhile (it.hasNext()) {\n    String name = it.next();\n    if (name.equals("Ben")) it.remove();\n}'
        },
        {
            id: 'java-collections-sort',
            group: 'Collections',
            name: 'Collections.sort and Comparator',
            syntax: 'list.sort(Comparator.comparing(...))',
            desc: 'Sorts a list. Use a Comparator for objects and multiple fields.',
            example: 'import java.util.*;\n\nList<String> names = new ArrayList<>(List.of("Cara", "Anna", "Ben"));\nnames.sort(Comparator.naturalOrder());\nnames.sort(Comparator.reverseOrder());\n\nList<Booking> bookings = new ArrayList<>();\nbookings.sort(Comparator.comparing(Booking::startDate));'
        },
        {
            id: 'java-class',
            group: 'OOP',
            name: 'class and object',
            syntax: 'class Hotel { ... }\nnew Hotel(...)',
            desc: 'A class defines fields and methods. new creates an object. The constructor initializes it.',
            example: 'class Hotel {\n    String name;\n    int stars;\n\n    Hotel(String name, int stars) {\n        this.name = name;\n        this.stars = stars;\n    }\n\n    void print() {\n        System.out.println(name + ", " + stars + " stars");\n    }\n}\n\nHotel hotel = new Hotel("Danube View", 4);\nhotel.print();'
        },
        {
            id: 'java-constructor',
            group: 'OOP',
            name: 'constructor',
            syntax: 'ClassName(params) { ... }',
            desc: 'Runs when an object is created. It has the class name and no return type. Use this to separate fields from parameters.',
            example: 'class Guest {\n    private final String name;\n    private int nights;\n\n    Guest(String name, int nights) {\n        this.name = name;\n        this.nights = nights;\n    }\n}'
        },
        {
            id: 'java-getter-setter',
            group: 'OOP',
            name: 'getters and setters',
            syntax: 'public String getName() { return name; }',
            desc: 'Control access to private fields. A getter reads; a setter can validate before writing.',
            example: 'class Guest {\n    private String name;\n\n    public String getName() {\n        return name;\n    }\n\n    public void setName(String name) {\n        if (name == null || name.isBlank()) throw new IllegalArgumentException("Name required");\n        this.name = name;\n    }\n}'
        },
        {
            id: 'java-inheritance',
            group: 'OOP',
            name: 'extends',
            syntax: 'class Child extends Parent { ... }',
            desc: 'A subclass inherits fields and methods. Call super(...) first when the parent has a constructor with arguments.',
            example: 'class Room {\n    protected int number;\n\n    Room(int number) {\n        this.number = number;\n    }\n}\n\nclass Suite extends Room {\n    Suite(int number) {\n        super(number);\n    }\n}'
        },
        {
            id: 'java-interface',
            group: 'OOP',
            name: 'interface and implements',
            syntax: 'interface Payable { void pay(); }\nclass Bill implements Payable { ... }',
            desc: 'An interface declares a contract. A class can implement several interfaces. Methods are public by default.',
            example: 'interface Payable {\n    void pay(double amount);\n}\n\nclass CardPayment implements Payable {\n    public void pay(double amount) {\n        System.out.println("Paid " + amount);\n    }\n}'
        },
        {
            id: 'java-abstract',
            group: 'OOP',
            name: 'abstract class and method',
            syntax: 'abstract class Shape { abstract double area(); }',
            desc: 'An abstract class cannot be instantiated. Subclasses must implement abstract methods.',
            example: 'abstract class Shape {\n    abstract double area();\n}\n\nclass Square extends Shape {\n    double side = 2;\n\n    double area() {\n        return side * side;\n    }\n}'
        },
        {
            id: 'java-enum',
            group: 'OOP',
            name: 'enum',
            syntax: 'enum Status { NEW, PAID, CANCELLED }',
            desc: 'A fixed set of constants. Enums can have fields, constructors, and methods.',
            example: 'enum Status {\n    NEW, PAID, CANCELLED\n}\n\nStatus status = Status.PAID;\nif (status == Status.PAID) {\n    System.out.println("Paid");\n}'
        },
        {
            id: 'java-record',
            group: 'OOP',
            name: 'record',
            syntax: 'record Booking(String guest, int nights) {}',
            desc: 'A compact immutable data class. The compiler creates the constructor, accessors, equals, hashCode, and toString.',
            example: 'record Booking(String guest, int nights) {}\n\nBooking booking = new Booking("Anna", 3);\nSystem.out.println(booking.guest());\nSystem.out.println(booking); // Booking[guest=Anna, nights=3]'
        },
        {
            id: 'java-generics',
            group: 'OOP',
            name: 'generics',
            syntax: 'class Box<T> { T value; }',
            desc: 'Lets a class or method work with a type chosen by the caller, with compile-time checking.',
            example: 'class Box<T> {\n    private T value;\n\n    void set(T value) {\n        this.value = value;\n    }\n\n    T get() {\n        return value;\n    }\n}\n\nBox<String> box = new Box<>();\nbox.set("hello");'
        },
        {
            id: 'java-static',
            group: 'OOP',
            name: 'static',
            syntax: 'static int count;',
            desc: 'Belongs to the class, not to an instance. Static methods cannot use instance fields directly.',
            example: 'class Counter {\n    static int count = 0;\n\n    static void increment() {\n        count++;\n    }\n}\n\nCounter.increment();\nSystem.out.println(Counter.count); // 1'
        },
        {
            id: 'java-exception',
            group: 'Exceptions',
            name: 'try, catch, finally',
            syntax: 'try { ... } catch (Exception e) { ... } finally { ... }',
            desc: 'Handles exceptions. Catch the most specific type first. finally always runs.',
            example: 'try {\n    int number = Integer.parseInt("abc");\n    System.out.println(number);\n} catch (NumberFormatException e) {\n    System.out.println("Not a number: " + e.getMessage());\n} finally {\n    System.out.println("done");\n}'
        },
        {
            id: 'java-throw',
            group: 'Exceptions',
            name: 'throw and throws',
            syntax: 'throw new IllegalArgumentException("message");',
            desc: 'throw raises an exception. throws declares that a method may pass one to the caller.',
            example: 'static int parseAge(String text) {\n    int age = Integer.parseInt(text);\n    if (age < 0) throw new IllegalArgumentException("Age cannot be negative");\n    return age;\n}\n\nstatic void readFile() throws IOException {\n    Files.readString(Path.of("data.txt"));\n}'
        },
        {
            id: 'java-custom-exception',
            group: 'Exceptions',
            name: 'custom exception',
            syntax: 'class MyException extends RuntimeException { ... }',
            desc: 'Create a specific exception for a domain error. Extend RuntimeException for unchecked, Exception for checked.',
            example: 'class BookingException extends RuntimeException {\n    BookingException(String message) {\n        super(message);\n    }\n}\n\nthrow new BookingException("Hotel is full");'
        },
        {
            id: 'java-try-with-resources',
            group: 'Exceptions',
            name: 'try-with-resources',
            syntax: 'try (BufferedReader br = Files.newBufferedReader(path)) { ... }',
            desc: 'Closes resources automatically, even when an exception happens. The resource must implement AutoCloseable.',
            example: 'import java.io.*;\nimport java.nio.file.*;\n\ntry (BufferedReader br = Files.newBufferedReader(Path.of("data.txt"))) {\n    String line;\n    while ((line = br.readLine()) != null) {\n        System.out.println(line);\n    }\n}'
        },
        {
            id: 'java-files-read',
            group: 'Files',
            name: 'Files.readAllLines and readString',
            syntax: 'Files.readAllLines(Path.of("file.txt"))',
            desc: 'Reads a whole text file. Use readAllLines for line-by-line processing and readString for one string.',
            example: 'import java.nio.file.*;\nimport java.util.*;\n\nList<String> lines = Files.readAllLines(Path.of("bookings.csv"));\nString all = Files.readString(Path.of("notes.txt"));\n\nfor (String line : lines) {\n    System.out.println(line);\n}'
        },
        {
            id: 'java-bufferedreader',
            group: 'Files',
            name: 'BufferedReader',
            syntax: 'new BufferedReader(new FileReader("file.txt"))',
            desc: 'Reads text line by line. It is memory-friendly for large files. Use try-with-resources.',
            example: 'import java.io.*;\n\ntry (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {\n    String line;\n    while ((line = br.readLine()) != null) {\n        System.out.println(line);\n    }\n}'
        },
        {
            id: 'java-files-write',
            group: 'Files',
            name: 'Files.write and BufferedWriter',
            syntax: 'Files.write(Path.of("out.txt"), lines)',
            desc: 'Writes text to a file. Files.write replaces the file; use StandardOpenOption.APPEND to add.',
            example: 'import java.nio.file.*;\nimport java.util.*;\n\nList<String> lines = List.of("Anna", "Ben");\nFiles.write(Path.of("out.txt"), lines);\n\nFiles.write(Path.of("out.txt"), List.of("Cara"), StandardOpenOption.APPEND);'
        },
        {
            id: 'java-csv-split',
            group: 'Files',
            name: 'CSV split',
            syntax: 'line.split(",", -1)',
            desc: 'Splits a CSV line. The -1 limit keeps empty trailing fields. Check the header before parsing data rows.',
            example: 'String line = "anna@example.com,Anna,Kovacs,,1998-05-12";\nString[] parts = line.split(",", -1);\n\nString email = parts[0];\nString first = parts[1];\nString birthday = parts[4];\nSystem.out.println(email + " " + first + " " + birthday);'
        },
        {
            id: 'java-localdate',
            group: 'Dates',
            name: 'LocalDate',
            syntax: 'LocalDate date = LocalDate.parse("2026-07-01");',
            desc: 'A date without time. parse reads yyyy-mm-dd. Dates can be compared and subtracted.',
            example: 'import java.time.*;\nimport java.time.temporal.ChronoUnit;\n\nLocalDate start = LocalDate.parse("2026-07-01");\nLocalDate end = LocalDate.parse("2026-07-04");\n\nlong nights = ChronoUnit.DAYS.between(start, end);\nSystem.out.println(nights); // 3\nSystem.out.println(start.plusDays(7));'
        },
        {
            id: 'java-datetimeformatter',
            group: 'Dates',
            name: 'DateTimeFormatter',
            syntax: 'DateTimeFormatter.ofPattern("yyyy-MM-dd")',
            desc: 'Formats and parses dates. Use the pattern letters carefully: MM month, dd day, yyyy year.',
            example: 'import java.time.*;\nimport java.time.format.*;\n\nLocalDate date = LocalDate.of(2026, 7, 1);\nDateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");\nSystem.out.println(date.format(fmt)); // 2026-07-01\n\nLocalDate parsed = LocalDate.parse("2026-07-01", fmt);'
        },
        {
            id: 'java-lambda',
            group: 'Streams',
            name: 'lambda expression',
            syntax: '(a, b) -> a + b',
            desc: 'A short implementation of a functional interface. Use it with Comparator, Runnable, and stream operations.',
            example: 'import java.util.*;\n\nList<String> names = new ArrayList<>(List.of("Cara", "Anna"));\nnames.sort((a, b) -> a.compareTo(b));\n\nRunnable task = () -> System.out.println("run");\ntask.run();'
        },
        {
            id: 'java-stream',
            group: 'Streams',
            name: 'stream',
            syntax: 'list.stream().filter(...).map(...).toList()',
            desc: 'Processes a collection with a chain of operations. Streams do not change the source unless you collect or forEach.',
            example: 'import java.util.*;\n\nList<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);\nList<Integer> even = numbers.stream()\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * 10)\n    .toList();\n\nSystem.out.println(even); // [20, 40, 60]'
        },
        {
            id: 'java-stream-sum',
            group: 'Streams',
            name: 'mapToInt and sum',
            syntax: 'list.stream().mapToInt(x -> x).sum()',
            desc: 'Converts objects to a primitive stream and calculates sum, average, min, or max.',
            example: 'import java.util.*;\n\nList<Integer> nights = List.of(2, 3, 5);\nint total = nights.stream().mapToInt(Integer::intValue).sum();\ndouble avg = nights.stream().mapToInt(Integer::intValue).average().orElse(0);\n\nSystem.out.println(total); // 10\nSystem.out.println(avg);   // 3.333...'
        },
        {
            id: 'java-stream-group',
            group: 'Streams',
            name: 'Collectors.groupingBy and counting',
            syntax: 'collect(Collectors.groupingBy(x -> x.key, Collectors.counting()))',
            desc: 'Groups stream items by a key and counts them. Useful for statistics by year, city, or hotel.',
            example: 'import java.util.*;\nimport java.util.stream.*;\n\nList<String> guests = List.of("Anna", "Ben", "Anna");\nMap<String, Long> counts = guests.stream()\n    .collect(Collectors.groupingBy(g -> g, Collectors.counting()));\n\nSystem.out.println(counts); // {Anna=2, Ben=1}'
        },
        {
            id: 'java-optional',
            group: 'Streams',
            name: 'Optional',
            syntax: 'Optional.of(value)\nOptional.empty()',
            desc: 'Represents a value that may be missing. Use orElse, ifPresent, map, and orElseThrow instead of null checks.',
            example: 'import java.util.*;\n\nOptional<String> name = Optional.of("Anna");\nSystem.out.println(name.orElse("Guest")); // Anna\n\nOptional<String> empty = Optional.empty();\nSystem.out.println(empty.orElse("Guest")); // Guest'
        },
        {
            id: 'java-thread',
            group: 'Threads',
            name: 'Thread and Runnable',
            syntax: 'new Thread(() -> { ... }).start();',
            desc: 'Runs code on another thread. start() creates the thread; run() would run it on the current thread.',
            example: 'Thread worker = new Thread(() -> {\n    System.out.println("working");\n});\nworker.start();\nworker.join();'
        },
        {
            id: 'java-jdbc',
            group: 'JDBC',
            name: 'JDBC connection',
            syntax: 'DriverManager.getConnection(url, user, password)',
            desc: 'Connects to a database. Use PreparedStatement with ? placeholders to avoid SQL injection.',
            example: 'import java.sql.*;\n\nString url = "jdbc:mysql://localhost:3306/bookings";\ntry (Connection conn = DriverManager.getConnection(url, "root", "password")) {\n    System.out.println("connected");\n}'
        },
        {
            id: 'java-preparedstatement',
            group: 'JDBC',
            name: 'PreparedStatement',
            syntax: 'PreparedStatement ps = conn.prepareStatement("SELECT * FROM hotels WHERE id = ?");',
            desc: 'Runs a parameterized query. setInt, setString, and setDate fill the placeholders safely.',
            example: 'String sql = "SELECT name, stars FROM hotels WHERE id = ?";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n    ps.setInt(1, 3);\n    try (ResultSet rs = ps.executeQuery()) {\n        while (rs.next()) {\n            System.out.println(rs.getString("name"));\n        }\n    }\n}'
        },
        {
            id: 'java-resultset',
            group: 'JDBC',
            name: 'ResultSet',
            syntax: 'while (rs.next()) { rs.getString("column"); }',
            desc: 'Holds query rows. next() moves to the next row and returns false when there are no more.',
            example: 'while (rs.next()) {\n    int id = rs.getInt("id");\n    String name = rs.getString("name");\n    int stars = rs.getInt("stars");\n    System.out.println(id + " " + name + " " + stars);\n}'
        },
        {
            id: 'java-jdbc-update',
            group: 'JDBC',
            name: 'executeUpdate',
            syntax: 'int rows = ps.executeUpdate();',
            desc: 'Runs INSERT, UPDATE, or DELETE and returns the number of affected rows.',
            example: 'String sql = "UPDATE hotels SET stars = ? WHERE id = ?";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n    ps.setInt(1, 5);\n    ps.setInt(2, 3);\n    int rows = ps.executeUpdate();\n    System.out.println(rows + " row(s) updated");\n}'
        }
    ];

    window.WIKI_REFERENCE = (window.WIKI_REFERENCE || []).concat(
        entries.map((entry) => ({ lang, ...entry }))
    );
})();
