# while and do-while

Java command · Control flow

while checks before each run. do-while runs at least once.

## Syntax

```java
while (condition) { ... }
do { ... } while (condition);
```

## Example

```java
int tries = 0;
while (tries < 3) {
    tries++;
}

int n;
do {
    n = 1;
} while (n < 0);
```
