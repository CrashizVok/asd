# Scanner input

Java topic · Exam Wiki

```java
Scanner scanner = new Scanner(System.in);
System.out.print("Hotel id: ");
int id = Integer.parseInt(scanner.nextLine().trim());
```

Read the whole line with `nextLine`, then parse. Mixing `nextInt` and `nextLine` leaves the newline in the buffer, which causes the next read to return an empty string.
