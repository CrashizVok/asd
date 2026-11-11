# HashMap put and get

Java command · Maps

Stores a value under a key and reads it back. Average cost is constant; one null key and null values are allowed.

## Syntax

```java
map.put(key, value); map.get(key)
```

## Example

```java
Map<String, Integer> nightsByCity = new HashMap<>();
nightsByCity.put("Budapest", 12);
nightsByCity.put("Vienna", 7);

int nights = nightsByCity.get("Budapest");   // 12
boolean hasPraha = nightsByCity.containsKey("Praha");   // false
System.out.println(nightsByCity);
```

## Details

Iteration order follows the hash and changes after a resize, so never rely on it. A key class needs both `equals` and `hashCode`; a `record` supplies them.
