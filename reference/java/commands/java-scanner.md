# Scanner

Java command · Basics

Reads console input. nextLine reads a whole line; nextInt reads an integer. Close it when done.

## Syntax

```java
Scanner sc = new Scanner(System.in);
```

## Example

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
System.out.print("Name: ");
String name = sc.nextLine();
System.out.print("Age: ");
int age = sc.nextInt();
sc.close();
```
