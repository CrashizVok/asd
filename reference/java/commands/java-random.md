# Random

Java command · Numbers

Generates random values. nextInt(bound) returns 0 to bound - 1.

## Syntax

```java
Random random = new Random();
random.nextInt(6) + 1
```

## Example

```java
import java.util.Random;

Random random = new Random();
int dice = random.nextInt(6) + 1;
int index = random.nextInt(10);
```
