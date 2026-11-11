# entrySet

Java command · Maps

Iterates keys and values together without a second lookup. keySet() and values() cover the other two views.

## Syntax

```java
for (Map.Entry<K, V> e : map.entrySet())
```

## Example

```java
Map<String, Integer> revenue = new TreeMap<>();
revenue.put("Danube View", 640);
revenue.put("City Inn", 180);

for (Map.Entry<String, Integer> entry : revenue.entrySet()) {
    System.out.printf("%-12s %5d%n", entry.getKey(), entry.getValue());
}

int total = 0;
for (int value : revenue.values()) {
    total += value;
}
```
